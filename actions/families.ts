"use server";
import { MAX_FAMILY_IMAGE_UPLOAD_SIZE } from "@/config";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { deleteFile, getUploadFileUrl } from "@/lib/s3";
import { FamilySchema, InviteUserSchema } from "@/schemas";
import { actionResponse, error, family, member, success } from "@/types";
import * as z from "zod";

//------------------ UTILS ------------------:

// - Check if the user is a member of the family and obtain the user
export const checkUserFamilyMember = async (
  familyId: string,
  checkAdmin: boolean = true
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

//------------------ ACTIONS ------------------:

// - Create new family
type createFamilyResponse = error | (success & { id: string });
export const createFamily = async (
  values: z.infer<typeof FamilySchema>
): Promise<createFamilyResponse> => {
  try {
    // Validate fields
    const validatedFields = FamilySchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");

    // Get fields
    const { name, description, image } = validatedFields.data;

    // Get current user
    const user = await safeGetSessionUser();

    // Create family
    const family = await db.family.create({
      data: {
        name,
        description,
        image,
        members: {
          create: {
            userId: user.id as string,
            role: "ADMIN",
          },
        },
      },
    });
    return { success: "Familia creada amb èxit!", id: family.id };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Get family (to display it in the family page)
type getFamilyResponse = error | (family & { admin: boolean });
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

// - Get family members
type getFamilyMembersResponse = error | { members: member[]; admin: boolean };
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

// - Promote user to admin
// TYPE: actionResponse = error | success;
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

// - Demote user from admin
// TYPE: actionResponse = error | success;
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

// - Kick user from family
// TYPE: actionResponse = error | success;
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

// - Invite user to family
// TYPE: actionResponse = error | success;
export const inviteUser = async (
  values: z.infer<typeof InviteUserSchema>,
  familyId: string
): Promise<actionResponse> => {
  try {
    // Parse the email
    const validatedFields = InviteUserSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");
    const { email } = validatedFields.data;

    // Get invited user
    const invitedUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!invitedUser) throw new Error("show: Usuari no trobat!");

    // Get current user and check if the user is an admin of the family
    const { user } = await checkUserFamilyMember(familyId, true);

    // Start transaction to invite user
    await db.$transaction(async (prisma) => {
      // Check if user already has a pending invitation
      const existingInvite = await prisma.invitation.findFirst({
        where: {
          inviteeId: invitedUser.id,
          status: "PENDING",
        },
      });
      if (existingInvite)
        throw new Error("show: Aquest usuari ja ha estat convidat!");

      // Invite user
      await prisma.invitation.create({
        data: {
          inviterId: user.id as string,
          inviteeId: invitedUser.id,
          familyId: familyId,
          status: "PENDING",
        },
      });
    });
    return { success: "Usuari convidat a la familia!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Edit family
// TYPE: actionResponse = error | success;
export const editFamily = async (
  values: z.infer<typeof FamilySchema>,
  familyId: string
): Promise<actionResponse> => {
  try {
    // Validate fields
    const validatedFields = FamilySchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");
    const { name, description } = validatedFields.data;

    //Check if the user is an admin of the family
    await checkUserFamilyMember(familyId, true);

    // Update family
    const updatedFamily = await db.family.update({
      where: {
        id: familyId,
      },
      data: {
        name,
        description,
      },
    });

    return { success: "Familia actualitzada amb èxit!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Leave family
// TYPE: actionResponse = error | success;
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

// - Get user families
type getUserFamiliesResponse = error | (family & { members: number })[];
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

// - Provide a signed URL for the client to upload a family
export type getFamilySignedImageURLResponse =
  | { uploadUrl: string; image: string }
  | error;
export async function getFamilySignedImageURL(
  type: string,
  size: number,
  checksum: string
): Promise<getFamilySignedImageURLResponse> {
  try {
    // Check if the file is an image
    if (!type.startsWith("image/")) {
      throw new Error("show: Extensió de l'arxiu invalida");
    }

    // Check if the file is too big
    if (size > MAX_FAMILY_IMAGE_UPLOAD_SIZE * 1024 * 1024) {
      throw new Error(
        `show: La imatge ha d'ocupar menys de ${MAX_FAMILY_IMAGE_UPLOAD_SIZE}MB`
      );
    }

    // Check if the user is logged in
    await safeGetSessionUser();

    // Get signed URL
    const { signedURL, fileURL } = await getUploadFileUrl({
      type,
      size,
      checksum,
      metadata: "familyImage",
    });

    return { uploadUrl: signedURL, image: fileURL };
  } catch (e: any) {
    return errorHandler(e);
  }
}

// - Delete family image
// TYPE: actionResponse = error | success;
export async function deleteFamilyImage(url: string): Promise<actionResponse> {
  try {
    // Get user
    const user = await safeGetSessionUser();

    await db.$transaction(async () => {
      // Make sure the user owns the image
      const family = await db.family.findFirst({
        where: { image: url },
        include: {
          members: {
            where: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
      });

      // If it's not associated with a family, delete the image
      if (!family) {
        await deleteFile(url);
        return;
      }

      if (family.members.length === 0)
        throw new Error("show: No autoritzat per eliminar la imatge");

      // Delete the image from the database
      await db.family.update({
        where: { id: family.id },
        data: {
          image: null,
        },
      });

      // Delete the image from the S3 bucket
      await deleteFile(url);
    });
    return { success: "Imatge eliminada amb èxit" };
  } catch (e: any) {
    return errorHandler(e);
  }
}
