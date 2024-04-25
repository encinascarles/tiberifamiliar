"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// Get user invitations
export const getUserInvitations = async () => {
  const user = await currentUser();

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

// Accept invitation
export const acceptInvitation = async (invitationId: string) => {
  //check if the user is the invited user
  const user = await currentUser();
  if (!user?.id) return { error: "Usuari no trobat" };

  const invitation = await db.invitation.findFirst({
    where: {
      id: invitationId,
      inviteeId: user.id,
    },
  });

  if (!invitation) {
    return { error: "No tens cap invitació amb aquest id" };
  }

  //create the family member
  await db.familyMembership.create({
    data: {
      userId: user.id,
      familyId: invitation.familyId,
    },
  });

  //update the invitation status
  await db.invitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  return { success: "Invitació acceptada!" };
};

// Reject invitation
export const rejectInvitation = async (invitationId: string) => {
  //check if the user is the invited user
  const user = await currentUser();
  if (!user?.id) return { error: "Usuari no trobat" };

  const invitation = await db.invitation.findFirst({
    where: {
      id: invitationId,
      inviteeId: user.id,
    },
  });

  if (!invitation) {
    return { error: "No tens cap invitació amb aquest id" };
  }

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
};
