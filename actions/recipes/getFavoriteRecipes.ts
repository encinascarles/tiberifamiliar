"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesPaginationResponse } from "./TYPES";
import { prepareRecipeResponse } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Get all favorite recipes

//------------------ RESPONSE TYPE ------------------:

// TYPE: recipesPaginationResponse = { recipes: recipeAndAuthor[] , total: number } | error

//------------------ ACTION ------------------:

export const getFavoriteRecipes = async (
  page: number,
  take: number
): Promise<recipesPaginationResponse> => {
  try {
    // Get favorite recipes
    const user = await safeGetSessionUser();

    // Get all favorite recipes from the user
    const fullUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        favoriteRecipes: {
          where: {
            draft: false,
          },
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          take: take,
          skip: (page - 1) * take,
        },
      },
    });
    if (!fullUser) throw new Error("show: Usuari no trobat!");

    // Count the user total favorite recipes
    const total = await db.recipe.count({
      where: {
        favoritedBy: {
          some: {
            id: user.id,
          },
        },
      },
    });

    // Prepare response
    const recipesToSend = fullUser.favoriteRecipes.map((recipe) =>
      prepareRecipeResponse(recipe, user.id)
    );

    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};
