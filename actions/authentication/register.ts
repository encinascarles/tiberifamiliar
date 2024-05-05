"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/schemas";
import { actionResponse } from "@/types";
import bcrypt from "bcryptjs";
import * as z from "zod";

//------------------ DESCRIPTION ------------------:

// - Register the user with credentials

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

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
