"use server";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  LoginSchema,
  NewPasswordSchema,
  PasswordResetSchema,
  RegisterSchema,
} from "@/schemas";
import { actionResponse } from "@/types";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import * as z from "zod";

// - Login the user with credentials
// TYPE: actionResponse | undefined = error | success | undefined;
export const login = async (
  values: z.infer<typeof LoginSchema>
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
        redirectTo: DEFAULT_LOGIN_REDIRECT, //TODO redirect to the previous page
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

// - Register the user with credentials
// TYPE: actionResponse = error | success;
export const register = async (
  values: z.infer<typeof RegisterSchema>
): Promise<actionResponse> => {
  try {
    // Validate fields
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invalids!");
    const { email, password, name } = validatedFields.data;

    // Check if user already exists with this email
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new Error(
        "show: Ja existeix un usuari amb aquest correu electrònic!"
      );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Send verification email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "S'ha enviat un correu de verificació!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Verify the user with a token
// TYPE: actionResponse = error | success;
export const newVerification = async (
  token: string
): Promise<actionResponse> => {
  try {
    // Get token from database
    const existingToken = await db.verificationToken.findUnique({
      where: { token },
    });
    if (!existingToken) {
      throw new Error("show: Token invàlid!");
    }

    // Check if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      throw new Error("show: El token ha expirat!");
    }

    // Update user email and emailVerified
    await db.user.update({
      where: { email: existingToken.email },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Correu electrònic verificat!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Reset the password with an email (ask for a token to be sent to the email)
// TYPE: actionResponse = error | success;
export const resetPassword = async (
  values: z.infer<typeof PasswordResetSchema>
): Promise<actionResponse> => {
  try {
    // Validate fields
    const validatedFields = PasswordResetSchema.safeParse(values);
    if (!validatedFields.success)
      throw new Error("show: Correu electrònic invàlid!");
    const { email } = validatedFields.data;

    // Check if user exists with this email
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (!existingUser)
      throw new Error("show: No existeix cap usuari amb aquest correu!");

    // Generate token and send email
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, passwordResetToken.token);

    return { success: "S'ha enviat un correu amb les instruccions" };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Reset the password with a token
// TYPE: actionResponse = error | success;
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string
): Promise<actionResponse> => {
  try {
    // Validate fields
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps incorrectes!");
    const { password } = validatedFields.data;

    // Get token from database
    const existingToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    if (!existingToken) throw new Error("show: Token no vàlid!");

    // Check if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) throw new Error("show: El token ha expirat!");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and delete token in a transaction
    await db.$transaction(async () => {
      await db.user.update({
        where: { email: existingToken.email },
        data: { password: hashedPassword },
      });

      // Delete token
      await db.passwordResetToken.delete({ where: { id: existingToken.id } });
    });

    return { success: "Contrassenya actualitzada correctament!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
