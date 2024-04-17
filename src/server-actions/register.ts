"use server";
import * as z from "zod";
import bcrype from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { db } from "@/db/db";
import { get } from "http";
import { getUserByEmail } from "@/db/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Camps invalids!" };
  }

  const { email, password, name, username } = validatedFields.data;
  const hashedPassword = await bcrype.hash(password, 10);

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
