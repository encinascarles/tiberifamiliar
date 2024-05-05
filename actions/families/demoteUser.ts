"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { actionResponse } from "@/types";
import { checkUserFamilyMember } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Demote user from admin

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const demoteUser = async (
  userId: string,
  familyId: string
): Promise<actionResponse> => {
  try {
    // Check if the user is an admin of the family
    await checkUserFamilyMember(familyId, true);

    // Demote user
    const membership = await db.familyMembership.update({
      where: {
        userId_familyId: {
          userId: userId,
          familyId: familyId,
        },
      },
      data: {
        role: "MEMBER",
      },
    });

    return { success: "Usuari degradat a membre!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
