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
          status: {
            in: ["PENDING", "SEEN"],
          },
        },
        include: {
          inviter: true,
          family: true,
        },
      });

      // Change status to seen
      await db.invitation.updateMany({
        where: {
          inviteeId: user?.id,
          status: "PENDING",
        },
        data: {
          status: "SEEN",
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
          seen: invitation.status === "SEEN",
        };
      });
      console.log("invitacio");
      return invitationsToSend;
    } catch (e: any) {
      return errorHandler(e);
    }
  };
