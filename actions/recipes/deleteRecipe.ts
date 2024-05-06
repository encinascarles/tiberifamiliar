"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { actionResponse } from "@/types";
import { revalidatePath } from "next/cache";

//------------------ DESCRIPTION ------------------:

// - Delete recipe

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const deleteRecipe = async (
  recipeId: string
): Promise<actionResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Delete the recipe
    await db.recipe.delete({
      where: {
        id: recipeId,
        authorId: user.id,
      },
    });

    // Revalidate the recipes page and the users personal recipes page
    revalidatePath("/receptes");
    return { success: "Recepta eliminada amb èxit!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
