"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FamilySchema, InviteUserSchema } from "@/schemas";
import { actionResponse, error, family, member, success } from "@/types";
import * as z from "zod";

// Create new family
type createFamilyResponse = error | (success & { id: string });
export const createFamily = async (
  values: z.infer<typeof FamilySchema>
): Promise<createFamilyResponse> => {
  // Validate fields
  const validatedFields = FamilySchema.safeParse(values);
  if (!validatedFields.success) return { error: "Camps invàlids!" };

  // Get fields
  const { name, description } = validatedFields.data;

  // Get current user
  const user = await currentUser();

  if (!user) return { error: "Usuari no trobat!" };

  // Create family
  try {
    const family = await db.family.create({
      data: {
        name,
        description,
      },
    });
    // Add the creator as an admin to the family
    await db.familyMembership.create({
      data: {
        userId: user.id as string,
        familyId: family.id,
        role: "ADMIN", // Assuming 'ADMIN' is a valid role
      },
    });
    return { success: "Familia creada amb èxit!", id: family.id };
  } catch {
    return { error: "Error al crear la familia!" };
  }
};

// Get family
type getFamilyResponse = error | (family & { admin: boolean });
export const getFamily = async (
  familyId: string
): Promise<getFamilyResponse> => {
  // Get family
  let family = await db.family.findFirst({
    where: {
      id: familyId,
    },
  });

  if (!family) return { error: "Familia no trobada!" };

  //Check if the user is a member of the family
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };
  const isFamilyMember = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
    },
  });
  if (!isFamilyMember) return { error: "No ets membre d'aquesta familia!" };

  //Check if the user is an admin of the family
  const isAdmin = isFamilyMember.role === "ADMIN";

  // Return the family
  return {
    id: family.id,
    name: family.name,
    description: family.description,
    image: family.image,
    admin: isAdmin,
  };
};

// Get family members
type getFamilyMembersResponse = error | { members: member[]; admin: boolean };
export const getFamilyMembers = async (
  familyId: string
): Promise<getFamilyMembersResponse> => {
  // Get family members with their roles
  const members = await db.familyMembership.findMany({
    where: {
      familyId: familyId,
    },
    include: {
      user: true,
    },
  });

  //Check if the user is a member of the family
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };
  if (!members.find((member) => member.user.id === user.id)) {
    return { error: "No ets membre d'aquesta familia!" };
  }

  //Check if the user is an admin of the family
  const isUserAdmin = members.find(
    (member) => member.userId === user.id && member.role === "ADMIN"
  );

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

  return { members: membersToSend, admin: !!isUserAdmin };
};

// Promote user to admin
// TYPE: actionResponse = error | success;
export const promoteUser = async (
  userId: string,
  familyId: string
): Promise<actionResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Check if the user is an admin of the family
  const isUserAdmin = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
      role: "ADMIN",
    },
  });
  if (!isUserAdmin) return { error: "No tens permís per fer això!" };

  // Check if the user to promote is a member of the family
  const isUserMember = await db.familyMembership.findFirst({
    where: {
      userId: userId,
      familyId: familyId,
    },
  });
  if (!isUserMember) return { error: "Usuari no trobat!" };

  // Promote user
  try {
    await db.familyMembership.update({
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
  } catch {
    return { error: "Error al promocionar l'usuari!" };
  }
};

// Demote user from admin
// TYPE: actionResponse = error | success;
export const demoteUser = async (
  userId: string,
  familyId: string
): Promise<actionResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Check if the user is an admin of the family
  const isUserAdmin = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
      role: "ADMIN",
    },
  });
  if (!isUserAdmin) return { error: "No tens permís per fer això!" };

  // Check if the user to demote is a member of the family
  const isUserMember = await db.familyMembership.findFirst({
    where: {
      userId: userId,
      familyId: familyId,
    },
  });
  if (!isUserMember) return { error: "Usuari no trobat!" };

  // Demote user
  try {
    await db.familyMembership.update({
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
  } catch {
    return { error: "Error al degradar l'usuari!" };
  }
};

// Kick user from family
// TYPE: actionResponse = error | success;
export const kickUser = async (
  userId: string,
  familyId: string
): Promise<actionResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Check if the user is an admin of the family
  const isUserAdmin = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
      role: "ADMIN",
    },
  });
  if (!isUserAdmin) return { error: "No tens permís per fer això!" };

  // Kick user
  try {
    await db.familyMembership.delete({
      where: {
        userId_familyId: {
          userId: userId,
          familyId: familyId,
        },
      },
    });
    return { success: "Usuari expulsat de la familia!" };
  } catch {
    return { error: "Error al expulsar l'usuari!" };
  }
};

// Invite user to family
// TYPE: actionResponse = error | success;
export const inviteUser = async (
  values: z.infer<typeof InviteUserSchema>,
  familyId: string
): Promise<actionResponse> => {
  // Parse the email
  const validatedFields = InviteUserSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Camps invàlids!" };

  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Check if the user is an admin of the family
  const isUserAdmin = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
      role: "ADMIN",
    },
  });
  if (!isUserAdmin) return { error: "No tens permís per fer això!" };

  // Get invited user
  const invitedUser = await db.user.findFirst({
    where: {
      email: values.email,
    },
  });
  if (!invitedUser) return { error: "Usuari no trobat!" };

  // Check if the user to invite already exists
  const existingInvite = await db.invitation.findFirst({
    where: {
      inviteeId: invitedUser.id,
      status: "PENDING",
    },
  });
  if (existingInvite) return { error: "Aquest usuari ja ha estat convidat!" };

  // Invite user
  try {
    await db.invitation.create({
      data: {
        inviterId: user.id as string,
        inviteeId: invitedUser.id,
        familyId: familyId,
        status: "PENDING",
      },
    });
    return { success: "Usuari convidat a la familia!" };
  } catch {
    return { error: "Error al convidar l'usuari!" };
  }
};

// Edit family
// TYPE: actionResponse = error | success;
export const editFamily = async (
  values: z.infer<typeof FamilySchema>,
  familyId: string
): Promise<actionResponse> => {
  // Validate fields
  const validatedFields = FamilySchema.safeParse(values);
  if (!validatedFields.success) return { error: "Camps invàlids!" };
  const { name, description } = validatedFields.data;

  //Check if the user is an admin of the family
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };
  const isAdmin = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
      role: "ADMIN",
    },
  });
  if (!isAdmin) return { error: "No tens permís per fer això!" };

  // Check if there's a family with the same name
  const existingFamily = await db.family.findFirst({
    where: {
      name: name,
      NOT: {
        id: familyId,
      },
    },
  });
  if (existingFamily) {
    return { error: "Ja existeix una familia amb aquest nom!" };
  }

  // Update family
  try {
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
  } catch {
    return { error: "Error al actualitzar la familia!" };
  }
};

// Leave family
// TYPE: actionResponse = error | success;
export const leaveFamily = async (
  familyId: string
): Promise<actionResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Check if the user is a member of the family
  const isUserMember = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
    },
  });
  if (!isUserMember) return { error: "No ets membre d'aquesta familia!" };

  // Check if the user is the only member of the family
  const members = await db.familyMembership.findMany({
    where: {
      familyId: familyId,
    },
  });
  if (members.length === 1) {
    await db.family.delete({
      where: {
        id: familyId,
      },
    });
    return { success: "Has deixat la familia i s'ha eliminat!" };
  }

  // Check if the user is the only admin of the family
  const isAdmin = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
      role: "ADMIN",
    },
  });
  if (isAdmin) {
    // Check if there are other admins
    const otherAdmins = await db.familyMembership.findFirst({
      where: {
        familyId: familyId,
        role: "ADMIN",
        NOT: {
          userId: user.id,
        },
      },
    });
    // If there are no other admins, return an error
    if (!otherAdmins) {
      return { error: "No pots deixar la familia si ets l'únic admin!" };
    }
  }

  // Leave family
  try {
    await db.familyMembership.delete({
      where: {
        userId_familyId: {
          userId: user.id as string,
          familyId: familyId,
        },
      },
    });
    return { success: "Has deixat la familia!" };
  } catch {
    return { error: "Error al deixar la familia!" };
  }
};

// Get user families
type getUserFamiliesResponse = error | (family & { members: number })[];
export const getUserFamilies = async (): Promise<getUserFamiliesResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

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

  const familiesResponse = families.map((family) => ({
    id: family.family.id,
    name: family.family.name,
    description: family.family.description,
    image: family.family.image,
    members: family.family.members.length,
  }));

  return familiesResponse;
};
