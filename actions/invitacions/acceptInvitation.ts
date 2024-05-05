"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { actionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { checkUserInvitee } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Accept invitation

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const acceptInvitation = async (
  invitationId: string
): Promise<actionResponse> => {
  try {
    const { invitation } = await checkUserInvitee(invitationId);

    // Create the family member
    await db.familyMembership.create({
      data: {
        userId: invitation.inviteeId,
        familyId: invitation.familyId,
      },
    });

    // Update the invitation status
    await db.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    // Revalidate family page
    revalidatePath(`/families/${invitation.familyId}`, "page");
    return { success: "Invitació acceptada!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
