"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error, family } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Get user families

//------------------ RESPONSE TYPE ------------------:

type getUserFamiliesResponse = error | (family & { members: number })[];

//------------------ ACTION ------------------:

export const getUserFamilies = async (): Promise<getUserFamiliesResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get user families
    const families = await db.familyMembership.findMany({
      where: {
        userId: user.id,
      },
      include: {
        family: {
          include: {
            members: true,
          },
        },
      },
    });

    // Prepare the response
    const familiesResponse = families.map((family) => ({
      id: family.family.id,
      name: family.family.name,
      description: family.family.description,
      image: family.family.image,
      members: family.family.members.length,
    }));
    return familiesResponse;
  } catch (e: any) {
    return errorHandler(e);
  }
};
