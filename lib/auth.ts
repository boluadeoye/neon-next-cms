import type { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { sql } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'google' && token.sub) {
        const rows = await sql/*sql*/`
          INSERT INTO users_public (google_sub, email, name, image)
          VALUES (${token.sub}, ${token.email || null}, ${token.name || null}, ${(token as any).picture || null})
          ON CONFLICT (google_sub)
          DO UPDATE SET email=excluded.email, name=excluded.name, image=excluded.image
          RETURNING id
        `;
        (token as any).uid = rows?.[0]?.id || (token as any).uid || null;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = (token as any).uid || null;
      return session;
    },
  },
};
