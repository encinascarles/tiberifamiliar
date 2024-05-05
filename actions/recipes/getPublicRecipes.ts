"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesPaginationResponse } from "./TYPES";
import { prepareRecipeResponse } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Get all public recipes

//------------------ RESPONSE TYPE ------------------:

// TYPE: recipesPaginationResponse = { recipes: recipeAndAuthor[] , total: number } | error

//------------------ ACTION ------------------:

export const getPublicRecipes = async (
  page: number,
  take: number
): Promise<recipesPaginationResponse> => {
  try {
    // Get current user if exists
    const user = await currentUser();

    // Get all public recipes
    const recipes = await db.recipe.findMany({
      where: {
        visibility: "PUBLIC",
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

    // Get total number of public recipes
    const total = await db.recipe.count({
      where: {
        visibility: "PUBLIC",
        draft: false,
      },
    });

    // Prepare response
    const recipesToSend = recipes.map((recipe) =>
      prepareRecipeResponse(recipe, user?.id)
    );

    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};
