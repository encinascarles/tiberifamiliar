"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { InviteUserSchema } from "@/schemas";
import { actionResponse } from "@/types";
import * as z from "zod";
import { checkUserFamilyMember } from "./UTILS";
import { sendInviteEmail } from "@/lib/mail";

//------------------ DESCRIPTION ------------------:

// - Invite user to family

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const inviteUser = async (
  values: z.infer<typeof InviteUserSchema>,
  familyId: string
): Promise<actionResponse> => {
  try {
    // Parse the email
    const validatedFields = InviteUserSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");
    const { email } = validatedFields.data;

    // Get invited user
    const invitedUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!invitedUser) throw new Error("show: Usuari no trobat!");

    // Get current user and check if the user is an admin of the family
    const { user } = await checkUserFamilyMember(familyId, true);

    // Start transaction to invite user
    await db.$transaction(async (prisma) => {
      // Check if user already has a pending invitation
      const existingInvite = await prisma.invitation.findFirst({
        where: {
          inviteeId: invitedUser.id,
          status: "PENDING",
        },
      });
      if (existingInvite)
        throw new Error("show: Aquest usuari ja ha estat convidat!");

      // Invite user
      await prisma.invitation.create({
        data: {
          inviterId: user.id as string,
          inviteeId: invitedUser.id,
          familyId: familyId,
          status: "PENDING",
        },
      });
    });
    // Send email to invited user
    db.family
      .findUnique({
        where: { id: familyId },
      })
      .then(async (family) => {
        await sendInviteEmail(
          email,
          user.name as string,
          family?.name as string
        );
      })
      .then(() => {});
    return { success: "Usuari convidat a la familia!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
