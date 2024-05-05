"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { FamilySchema } from "@/schemas";
import { actionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { checkUserFamilyMember } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Edit family

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const editFamily = async (
  values: z.infer<typeof FamilySchema>,
  familyId: string
): Promise<actionResponse> => {
  try {
    // Validate fields
    const validatedFields = FamilySchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");
    const { name, description, image } = validatedFields.data;

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
        image,
      },
    });

    revalidatePath(`/families/${familyId}`, "page");
    return { success: "Familia actualitzada amb èxit!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
