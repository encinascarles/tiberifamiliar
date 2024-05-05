"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error } from "@/types";
import { revalidatePath } from "next/cache";

//------------------ DESCRIPTION ------------------:

// - Toggle favorite recipe

//------------------ RESPONSE TYPE ------------------:

type toggleFavoriteRecipe = { favorite: boolean } | error;

//------------------ ACTION ------------------:

export const toggleFavoriteRecipe = async (
  recipeId: string
): Promise<toggleFavoriteRecipe> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Check if the recipe is a favorite
    const favorite = await db.user.findFirst({
      where: {
        id: user.id,
        favoriteRecipes: {
          some: {
            id: recipeId,
          },
        },
      },
    });

    // Add or remove from favorites
    if (favorite) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          favoriteRecipes: {
            disconnect: {
              id: recipeId,
            },
          },
        },
      });
      revalidatePath("/receptes/${recipeId}");
      return { favorite: false };
    } else {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          favoriteRecipes: {
            connect: {
              id: recipeId,
            },
          },
        },
      });
      revalidatePath("/receptes/${recipeId}");
      return { favorite: true };
    }
  } catch (e: any) {
    return errorHandler(e);
  }
};
