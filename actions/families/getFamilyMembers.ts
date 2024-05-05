"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error, member } from "@/types";
import { checkUserFamilyMember } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Get family members

//------------------ RESPONSE TYPE ------------------:

export type getFamilyMembersResponse =
  | error
  | { members: member[]; admin: boolean };

//------------------ ACTION ------------------:

export const getFamilyMembers = async (
  familyId: string
): Promise<getFamilyMembersResponse> => {
  try {
    // Get current user and check if the user is a member of the family
    const { user, membership } = await checkUserFamilyMember(familyId);

    // Get family members with their roles
    const members = await db.familyMembership.findMany({
      where: {
        familyId: familyId,
      },
      include: {
        user: true,
      },
    });

    //Prepare the response
    const membersToSend = members.map((member) => {
      const myself = member.userId === user.id;
      return {
        id: member.userId,
        role: member.role,
        image: member.user.image,
        name: member.user.name,
        myself,
        familyId: familyId,
      };
    });
    return { members: membersToSend, admin: membership.role === "ADMIN" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
