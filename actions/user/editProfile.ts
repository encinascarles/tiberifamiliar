"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { EditProfileSchema } from "@/schemas";
import { actionResponse } from "@/types";
import bcrypt from "bcryptjs";
import * as z from "zod";

//------------------ DESCRIPTION ------------------:

// - Edit profile

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const editprofile = async (
  values: z.infer<typeof EditProfileSchema>
): Promise<actionResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Validate fields
    const validatedFields = EditProfileSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");
    const { originalPassword, newPassword, name, email } = validatedFields.data;

    //Update user in the database
    if (
      name !== user.name ||
      email !== user.email ||
      newPassword ||
      email !== user.email
    ) {
      // Get user from database
      const dbuser = await db.user.findUnique({
        where: { id: user.id },
      });
      if (!dbuser || !dbuser.password)
        throw new Error("show: Usuari no trobat!");
      let hashedPassword = dbuser.password;
      if (originalPassword && newPassword) {
        // Check if original password is correct
        const passwordMatch = await bcrypt.compare(
          originalPassword,
          dbuser.password
        );
        if (!passwordMatch) throw new Error("show: Contrasenya incorrecta!");
        // Hash new password
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }
      // Check if user changed email
      if (email !== user.email) {
        // Check if user already exists with this email
        const existingUser = await db.user.findUnique({
          where: { email },
        });
        if (existingUser)
          throw new Error(
            "show: Ja existeix un usuari amb aquest correu electrònic!"
          );
        // Send verification email
        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        );
      }
      // Update user
      await db.user.update({
        where: { id: user.id },
        data: {
          name,
          email,
          password: hashedPassword,
          emailVerified: email === user.email ? dbuser.emailVerified : null,
        },
      });
    }
    return { success: "Perfil actualitzat!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
