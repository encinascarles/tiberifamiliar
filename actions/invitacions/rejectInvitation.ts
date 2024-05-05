"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { actionResponse } from "@/types";
import { checkUserInvitee } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Reject invitation

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const rejectInvitation = async (
  invitationId: string
): Promise<actionResponse> => {
  try {
    await checkUserInvitee(invitationId);
    //update the invitation status
    await db.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: "DECLINED",
      },
    });
    return { success: "Invitació rebutjada!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
