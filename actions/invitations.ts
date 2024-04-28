"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { actionResponse, error, invitation } from "@/types";

//------------------ UTILS ------------------:

// - Check if the user is the invitee
const checkUserInvitee = async (invitationId: string) => {
  const user = await safeGetSessionUser();
  const invitation = await db.invitation.findFirst({
    where: {
      id: invitationId,
      inviteeId: user.id,
    },
  });
  if (!invitation) throw new Error("show: No tens cap invitació amb aquest id");
  return { invitation, user };
};

//------------------ ACTIONS ------------------:

// - Get user invitations
type getUserInvitationsResponse = error | invitation[];
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

// - Accept invitation
// TYPE: actionResponse = error | success;
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

    return { success: "Invitació acceptada!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Reject invitation
// TYPE: actionResponse = error | success;
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
