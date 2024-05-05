"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

//------------------ UTILS ------------------:

// - Get all user contacts (family members)
export type getUserFamilyMembersResponse = {
  users: string[];
  userId: string | undefined;
};
export const getUserFamiliesMembers =
  async (): Promise<getUserFamilyMembersResponse> => {
    // Get current user
    const user = await safeGetSessionUser();

    // Get all families the user is from with its members
    const families = await db.family.findMany({
      where: {
        members: {
          some: {
            userId: user?.id,
          },
        },
      },
      include: {
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Prepare response
    const contacts = families.flatMap((family) =>
      family.members.map((member) => member.userId)
    );
    const uniqueContacts = Array.from(new Set(contacts));

    // Return array of unique Ids
    return { users: uniqueContacts, userId: user.id };
  };
