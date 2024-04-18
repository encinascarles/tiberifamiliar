import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "@/db/db";
import { getUserById } from "@/db/data/user";

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

      //TODO Add 2fA check

      return true;
    },
    session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // if (token.username && session.user)
      //   session.user.username = token.username;
      // }

      return session;
    },
    // async jwt({ token }) {
    //   if (!token.sub) return token;

    //   console.log("buscant usuari...");
    //   const existingUser = await getUserById(token.sub);

    //   if (!existingUser) return token;

    //   token.username = existingUser.username;

    //   return token;
    // },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
