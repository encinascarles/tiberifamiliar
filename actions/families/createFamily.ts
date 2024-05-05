"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { FamilySchema } from "@/schemas";
import { error, success } from "@/types";
import * as z from "zod";

//------------------ DESCRIPTION ------------------:

// - Create new family

//------------------ RESPONSE TYPE ------------------:

type createFamilyResponse = error | (success & { id: string });

//------------------ ACTION ------------------:

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
