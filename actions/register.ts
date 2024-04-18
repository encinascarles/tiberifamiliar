"use server";
import { getUserByEmail } from "../data/user";
import { db } from "../lib/db";
import { RegisterSchema } from "../schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { generateVerificationToken } from "../lib/tokens";
import { sendVerificationEmail } from "../lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Camps invalids!" };
  }

  const { email, password, name, username } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "El correu electrònic ja està en us!" };
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      username,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "S'ha enviat un correu de verificació!" };
};
