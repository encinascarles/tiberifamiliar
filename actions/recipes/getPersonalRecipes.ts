"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesPaginationResponse } from "./TYPES";
import { prepareRecipeResponse } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Get all personal recipes

//------------------ RESPONSE TYPE ------------------:

// TYPE: recipesPaginationResponse = { recipes: recipeAndAuthor[] , total: number } | error

//------------------ ACTION ------------------:

export const getPersonalRecipes = async (
  page: number,
  take: number
): Promise<recipesPaginationResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get all recipes from the user that are not drafts
    const recipes = await db.recipe.findMany({
      where: {
        authorId: user?.id,
        draft: false,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        favoritedBy: {
          select: {
            id: true,
          },
        },
      },
      take: take,
      skip: (page - 1) * take,
    });

    // Get total number of recipes
    const total = await db.recipe.count({
      where: {
        authorId: user?.id,
        draft: false,
      },
    });

    // Prepare response
    const recipesToSend = recipes.map((recipe) =>
      prepareRecipeResponse(recipe, user.id)
    );
    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};
