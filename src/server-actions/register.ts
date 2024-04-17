"use server";
import { getUserByEmail } from "@/db/data/user";
import { db } from "@/db/db";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

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

  // TODO: Send email verification

  return { success: "Usuari creat!" };
};
