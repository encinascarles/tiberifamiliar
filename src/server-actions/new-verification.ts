"use server";

import { db } from "@/db/db";
import { getUserByEmail } from "@/db/data/user";
import { getVerificationTokenByToken } from "@/db/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Token invàlid!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "El token ha expirat!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "El correu no existeix!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Correu electrònic verificat!" };
};
