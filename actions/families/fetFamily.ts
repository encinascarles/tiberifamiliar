"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error, family } from "@/types";
import { checkUserFamilyMember } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Get family (to display it in the family page)

//------------------ RESPONSE TYPE ------------------:

type getFamilyResponse = error | (family & { admin: boolean });

//------------------ ACTION ------------------:

export const getFamily = async (
  familyId: string
): Promise<getFamilyResponse> => {
  try {
    // Get current user and check if the user is a member of the family
    const { membership } = await checkUserFamilyMember(familyId);

    // Get family
    let family = await db.family.findFirst({
      where: {
        id: familyId,
      },
    });
    if (!family) throw new Error("show: Familia no trobada!");

    // Return the family
    return {
      id: family.id,
      name: family.name,
      description: family.description,
      image: family.image,
      admin: membership.role === "ADMIN",
    };
  } catch (e: any) {
    return errorHandler(e);
  }
};
