"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { actionResponse } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Leave family

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const leaveFamily = async (
  familyId: string
): Promise<actionResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Start transaction to leave family
    await db.$transaction(async (prisma) => {
      // Check if the user is a member of the family
      const membership = await prisma.familyMembership.findFirst({
        where: {
          userId: user.id,
          familyId: familyId,
        },
      });
      if (!membership)
        throw new Error("show: No ets membre d'aquesta familia!");

      // Check if the user is the only member of the family
      const members = await prisma.familyMembership.count({
        where: {
          familyId: familyId,
        },
      });
      if (members === 1) {
        // Delete family
        await prisma.family.delete({
          where: {
            id: familyId,
          },
        });
        return;
      }

      // Check if the user is the only admin of the family
      if (membership.role === "ADMIN") {
        const otherAdmins = await prisma.familyMembership.count({
          where: {
            familyId: familyId,
            role: "ADMIN",
            NOT: {
              userId: user.id,
            },
          },
        });
        if (otherAdmins === 0) {
          throw new Error(
            "show: No pots deixar la familia si ets l'únic admin!"
          );
        }
      }

      // Leave family
      await prisma.familyMembership.delete({
        where: {
          userId_familyId: {
            userId: user.id as string,
            familyId: familyId,
          },
        },
      });
    });

    return { success: "Has deixat la familia!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
