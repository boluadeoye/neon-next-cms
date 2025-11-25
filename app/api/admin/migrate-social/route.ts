import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!process.env.MIGRATE_TOKEN || token !== process.env.MIGRATE_TOKEN) {
    return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });
  }
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

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

    await sql/*sql*/`ALTER TABLE comments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users_public(id) ON DELETE SET NULL;`;
    await sql/*sql*/`ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id integer NULL;`;
    await sql/*sql*/`ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0;`;
    await sql/*sql*/`CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);`;

    await sql/*sql*/`
    CREATE TABLE IF NOT EXISTS comment_likes (
      comment_id integer NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES users_public(id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (comment_id, user_id)
    );`;

    await sql/*sql*/`ALTER TABLE post_likes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users_public(id) ON DELETE SET NULL;`;

    await sql/*sql*/`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='uniq_post_likes_user') THEN
        CREATE UNIQUE INDEX uniq_post_likes_user ON post_likes(post_id, user_id) WHERE user_id IS NOT NULL;
      END IF;
    END$$;`;

    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: String(e?.message || e) }, { status: 500 });
  }
}
