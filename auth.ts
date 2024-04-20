import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { nanoid } from "nanoid";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/autherror",
  },
  events: {
    async linkAccount({ user }) {
      // set email to verified for new oauth accounts
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          username: `user-${nanoid(4)}`,
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id as string);

      //prevent login if email is not verified
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
