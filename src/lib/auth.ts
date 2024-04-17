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
  callbacks: {
    // async signIn({ user }) {
    //   const existingUser = await getUserById(user.id as string);
    //   if (!existingUser || !existingUser.emailVerified) {
    //     return false;
    //   }
    //   return true;
    // },
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
