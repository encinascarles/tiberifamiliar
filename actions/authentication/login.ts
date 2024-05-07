"use server";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { actionResponse } from "@/types";
import { AuthError } from "next-auth";
import * as z from "zod";

//------------------ DESCRIPTION ------------------:

// - Login the user with credentials

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse | undefined = error | success | undefined;

//------------------ ACTION ------------------:

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
): Promise<actionResponse | undefined> => {
  try {
    // Validate fields
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");
    const { email, password } = validatedFields.data;

    // Get user by email
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (!existingUser) throw new Error("show: Usuari no trobat!");

    // Check if user is registered with google
    if (!existingUser?.password)
      throw new Error(
        "show: Correu donat d'alta amb Google. Si us plau, inicia sessió amb Google."
      );

    // Check if user is verified
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(email, verificationToken.token);
      return { success: "S'ha reenviat el correu de verificació" };
    }

    // Sign in the user (authjs)
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT, //TODO redirect to the previous page
      });
    } catch (error) {
      if (error instanceof AuthError && error.type === "CredentialsSignin")
        throw new Error("show: Credencials invàlides");
      throw error;
    }
  } catch (e: any) {
    return errorHandler(e);
  }
};
