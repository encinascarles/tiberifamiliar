"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// Get user invitations
export const getUserInvitations = async () => {
  const user = await currentUser();

  const invitations = await db.invitation.findMany({
    where: {
      inviteeId: user?.id,
    },
    include: {
      inviter: true,
      family: true,
    },
  });

  const returnedData = invitations.map((invitation) => {
    return {
      id: invitation.id,
      inviterId: invitation.inviterId,
      inviterName: invitation.inviter.name,
      familyName: invitation.family.name,
      familyImage: invitation.family.image,
    };
  });

  return returnedData;
};
