import { readFileSync, existsSync } from 'fs';
import { neon } from '@neondatabase/serverless';

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) {
      const k = m[1];
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!(k in process.env)) process.env[k] = v;
    }
  }
}
if (!process.env.DATABASE_URL) loadEnvFile('.env.local');
if (!process.env.DATABASE_URL) loadEnvFile('.env');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function run() {
  // extensions
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

  // users_public
  await sql/*sql*/`
  CREATE TABLE IF NOT EXISTS users_public (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    google_sub text UNIQUE,
    email text UNIQUE,
    name text,
    image text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );`;

  // updated_at trigger (generic)
  await sql/*sql*/`
  CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
  BEGIN NEW.updated_at = now(); RETURN NEW; END;
  $$ LANGUAGE plpgsql;`;

  await sql/*sql*/`
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_users_public_updated_at') THEN
      CREATE TRIGGER trg_users_public_updated_at BEFORE UPDATE ON users_public
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
    END IF;
  END$$;`;

  // comments: ensure columns for user + replies + likes_count
  await sql/*sql*/`ALTER TABLE comments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users_public(id) ON DELETE SET NULL;`;
  await sql/*sql*/`ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id bigint NULL;`;
  await sql/*sql*/`ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count int NOT NULL DEFAULT 0;`;
  await sql/*sql*/`CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);`;

  // comment likes
  await sql/*sql*/`
  CREATE TABLE IF NOT EXISTS comment_likes (
    comment_id bigint NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users_public(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (comment_id, user_id)
  );`;

  // post likes: add user_id and unique constraint for user-based likes
  try { await sql/*sql*/`ALTER TABLE post_likes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users_public(id) ON DELETE SET NULL;`; } catch {}
  await sql/*sql*/`CREATE UNIQUE INDEX IF NOT EXISTS uniq_post_likes_user ON post_likes(post_id, user_id) WHERE user_id IS NOT NULL;`;

  console.log('✓ Migration complete');
}
run().catch(e => { console.error(e); process.exit(1); });
