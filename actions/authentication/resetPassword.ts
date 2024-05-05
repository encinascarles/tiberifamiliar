"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { PasswordResetSchema } from "@/schemas";
import { actionResponse } from "@/types";
import * as z from "zod";

//------------------ DESCRIPTION ------------------:

// - Reset the password with an email (ask for a token to be sent to the email)

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

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
