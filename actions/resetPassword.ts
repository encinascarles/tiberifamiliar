"use server";
import { getUserByEmail } from "../data/user";
import { PasswordResetSchema } from "../schemas";
import * as z from "zod";
import { sendPasswordResetEmail } from "../lib/mail";
import { generatePasswordResetToken } from "../lib/tokens";

export const resetPassword = async (
  values: z.infer<typeof PasswordResetSchema>
) => {
  const validatedFields = PasswordResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Correu electrònic invàlid!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser)
    return {
      error: "Correu no trobat!",
    };

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(email, passwordResetToken.token);

  return { success: "S'ha enviat un correu amb les instruccions" };
};
