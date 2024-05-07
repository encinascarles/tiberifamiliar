import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { sendWelcomeEmail } from "./lib/mail";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  //secret: "WH/zShoHiG9NoVdaibKrhw85lJFtH9H/2hhOSkCxHCM=", //TODO it fails if not set here
  pages: {
    signIn: "/login",
    error: "/autherror",
  },
  events: {
    async linkAccount({ user }) {
      // set email to verified for new oauth accounts
      const newuser = await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });

      // send welcome email to user
      await sendWelcomeEmail(newuser.email);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await db.user.findUnique({
        where: { id: user.id },
      });

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
    jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name;
        token.email = session.email;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
