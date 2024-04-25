"use server";
import * as z from "zod";
import { LoginSchema } from "../schemas";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "../lib/tokens";
import { getUserByEmail } from "../data/user";
import { sendVerificationEmail } from "../lib/mail";

interface loginResponse {
  error?: string;
  success?: string;
}
export const login = async (
  values: z.infer<typeof LoginSchema>
): Promise<loginResponse | undefined> => {
  // Validate fields
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Camps invàlids!" };
  }
  const { email, password } = validatedFields.data;

  // Get user by email
  const existingUser = await getUserByEmail(email);
  // Check if user is registered with google
  if (!existingUser?.password)
    return {
      error:
        "Correu registra't per google, si us plau, inicia sessió amb Google",
    };
  // Check if user is verified
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return { success: "S'ha reenviat el correu de verificació" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Credencials invàlides" };
        }
        default: {
          return { error: "Hi ha hagut un error" };
        }
      }
    }
    throw error;
  }
};
