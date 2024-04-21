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
