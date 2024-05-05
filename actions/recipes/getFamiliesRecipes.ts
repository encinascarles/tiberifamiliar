"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesPaginationResponse } from "./TYPES";
import { getUserFamiliesMembers, prepareRecipeResponse } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Get all families recipes

//------------------ RESPONSE TYPE ------------------:

// TYPE: recipesPaginationResponse = { recipes: recipeAndAuthor[] , total: number } | error

//------------------ ACTION ------------------:

export const getFamiliesRecipes = async (
  page: number,
  take: number
): Promise<recipesPaginationResponse> => {
  try {
    // Get all family members
    const { users, userId } = await getUserFamiliesMembers();

    // Get all public or family recipes from the family members
    const recipes = await db.recipe.findMany({
      where: {
        authorId: {
          in: users,
        },
        draft: false,
        NOT: {
          visibility: "PRIVATE",
        },
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
        authorId: {
          in: users,
        },
        draft: false,
        NOT: {
          visibility: "PRIVATE",
        },
      },
    });

    // Prepare response
    const recipesToSend = recipes.map((recipe) =>
      prepareRecipeResponse(recipe, userId)
    );

    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};
