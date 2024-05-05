"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { actionResponse } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Verify the user with a token

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const verifyEmail = async (token: string): Promise<actionResponse> => {
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
      // Send new verification email
      const verificationToken = await generateVerificationToken(
        existingToken.email
      );
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
      throw new Error(
        "show: El token ha expirat, s'ha enviat un nou correu de verificació!"
      );
    }

    // Update user email and emailVerified
    await db.user.update({
      where: { email: existingToken.email },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Correu electrònic verificat, inicia sessió!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
