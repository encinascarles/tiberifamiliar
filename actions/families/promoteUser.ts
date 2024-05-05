"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { actionResponse } from "@/types";
import { checkUserFamilyMember } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Promote user to admin

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const promoteUser = async (
  userId: string,
  familyId: string
): Promise<actionResponse> => {
  try {
    // Check if the user is an admin of the family
    await checkUserFamilyMember(familyId, true);

    // Promote user
    const membership = await db.familyMembership.update({
      where: {
        userId_familyId: {
          userId: userId,
          familyId: familyId,
        },
      },
      data: {
        role: "ADMIN",
      },
    });

    return { success: "Usuari promocionat a admin!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
