import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

//------------------ UTILS ------------------:

// - Check if the user is a member of the family and obtain the user and membership
export const checkUserFamilyMember = async (
  familyId: string,
  checkAdmin: boolean = false
) => {
  // Get current user from the session
  const user = await safeGetSessionUser();

  // Find user membership in the family
  const membership = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
    },
  });
  if (!membership) throw new Error("show: No ets membre d'aquesta familia!");

  // Check if the user is an admin of the family (only if checkAdmin is true)
  if (checkAdmin && membership.role !== "ADMIN")
    throw new Error("show: No tens permís per fer això!");

  // Return the user and the membership
  return { user, membership };
};
