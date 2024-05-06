import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

//------------------ UTILS ------------------:

// - Check if the user is the invitee
export const checkUserInvitee = async (invitationId: string) => {
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
