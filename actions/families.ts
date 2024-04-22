"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";
import { FamilySchema } from "@/schemas";

// Create new family
export const createFamily = async (values: z.infer<typeof FamilySchema>) => {
  // Validate fields
  const validatedFields = FamilySchema.safeParse(values);

  if (!validatedFields.success) return { error: "Camps invàlids!" };

  // Get fields
  const { name, description } = validatedFields.data;

  // Check if there's a family with the same name
  const existingFamily = await db.family.findFirst({
    where: {
      name: name,
    },
  });

  if (existingFamily) {
    return { error: "Ja existeix una familia amb aquest nom!" };
  }

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
export const getFamily = async (familyId: string) => {
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
  if (isFamilyMember.role === "ADMIN") {
    return { family, admin: true };
  }

  return { family, admin: false };
};

// Get family members
export const getFamilyMembers = async (familyId: string) => {
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
      username: member.user.username,
      myself,
      familyId: familyId,
    };
  });

  return { admin: isUserAdmin ? true : false, members: membersToSend };
};

// Promote user to admin
export const promoteUser = async (userId: string, familyId: string) => {
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
export const demoteUser = async (userId: string, familyId: string) => {
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
export const kickUser = async (userId: string, familyId: string) => {
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
