"use server";

import { getPasswordResetByToken } from "../data/password-reset-token";
import { getUserByEmail } from "../data/user";
import { db } from "../lib/db";
import { NewPasswordSchema } from "../schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

interface newPasswordResponse {
  error?: string;
  success?: string;
}
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
): Promise<newPasswordResponse> => {
  if (!token) return { error: "Falta el token!" };

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Campis incorrectes!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetByToken(token);

  if (!existingToken) return { error: "Token no vàlid!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "El token ha expirat!" };

  // Update user password
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Usuari no trobat!" };

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // Delete token
  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Contrassenya actualitzada correctament!" };
};
