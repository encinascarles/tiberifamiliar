"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

//------------------ DESCRIPTION ------------------:

// - Create empty recipe

//------------------ RESPONSE TYPE ------------------:

type createEmptyRecipeResponse = { id: string } | error;

//------------------ ACTION ------------------:

export const createEmptyRecipe =
  async (): Promise<createEmptyRecipeResponse> => {
    // Disable caching here
    try {
      // Get current user
      const user = await safeGetSessionUser();
      // Create empty recipe
      const recipe = await db.recipe.create({
        data: {
          authorId: user.id as string,
          draft: true,
        },
      });
      if (!recipe) throw new Error("show: Error al crear la recepta!");
      // Revalidate path

      revalidatePath("/receptes/nova");
      return { id: recipe.id };
    } catch (e: any) {
      return errorHandler(e);
    }
  };
