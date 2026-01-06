import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email login",
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const name = credentials?.name?.trim() || "Company User";
        if (!email) return null;

        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
          .then((rows) => rows[0]);

        if (existing) {
          return { id: existing.id, email: existing.email, name: existing.name };
        }

        const created = await db
          .insert(users)
          .values({
            id: randomUUID(),
            email,
            name,
          })
          .returning()
          .then((rows) => rows[0]);

        return { id: created.id, email: created.email, name: created.name };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        (session as any).user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


