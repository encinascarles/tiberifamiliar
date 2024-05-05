"use server";
import { signIn } from "@/auth";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { NewPasswordSchema } from "@/schemas";
import { actionResponse } from "@/types";
import bcrypt from "bcryptjs";
import * as z from "zod";

//------------------ DESCRIPTION ------------------:

// - Reset the password with a token

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

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

    // Check if user is logged in
    const user = await currentUser();
    if (!user) {
      // Login the user without redirect
      await signIn("credentials", {
        email: existingToken.email,
        password,
        redirect: false,
      });
    }
    //TODO send mail to user saying that the password has been changed
    return { success: "Contrassenya actualitzada correctament!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
