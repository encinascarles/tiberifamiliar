"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesResponse } from "./TYPES";
import { prepareRecipeResponse } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Get all draft recipes

//------------------ RESPONSE TYPE ------------------:

// TYPE: recipesResponse = recipeAndAuthor[] | error;

//------------------ ACTION ------------------:

export const getDraftRecipes = async (): Promise<recipesResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get all draft recipes from the user
    const recipes = await db.recipe.findMany({
      where: {
        authorId: user?.id,
        draft: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Prepare response
    const recipesToSend = recipes.map((recipe) =>
      prepareRecipeResponse(recipe, user?.id)
    );
    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};
