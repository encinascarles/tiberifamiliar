"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { actionResponse } from "@/types";
import { checkUserFamilyMember } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Kick user from family

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const kickUser = async (
  userId: string,
  familyId: string
): Promise<actionResponse> => {
  try {
    // Check if the user is an admin of the family
    await checkUserFamilyMember(familyId, true);

    // Kick user
    await db.familyMembership.delete({
      where: {
        userId_familyId: {
          userId: userId,
          familyId: familyId,
        },
      },
    });

    return { success: "Usuari expulsat de la familia!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
