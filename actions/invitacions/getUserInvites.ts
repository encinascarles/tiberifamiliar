"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error, invitation } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Get user invitations

//------------------ RESPONSE TYPE ------------------:

type getUserInvitationsResponse = error | invitation[];

//------------------ ACTION ------------------:

export const getUserInvitations =
  async (): Promise<getUserInvitationsResponse> => {
    try {
      // Get the current user
      const user = await safeGetSessionUser();

      // Get the user's invitations
      const invitations = await db.invitation.findMany({
        where: {
          inviteeId: user?.id,
          status: "PENDING",
        },
        include: {
          inviter: true,
          family: true,
        },
      });

      // Format the invitations to send
      const invitationsToSend = invitations.map((invitation) => {
        return {
          id: invitation.id,
          inviterId: invitation.inviterId,
          inviterName: invitation.inviter.name,
          familyName: invitation.family.name,
          familyImage: invitation.family.image,
        };
      });

      return invitationsToSend;
    } catch (e: any) {
      return errorHandler(e);
    }
  };
