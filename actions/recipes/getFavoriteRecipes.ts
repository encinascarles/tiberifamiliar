"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesPaginationResponse } from "./TYPES";

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
    const recipesToSend = fullUser.favoriteRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title as string,
      prep_time: recipe.prep_time as number,
      total_time: recipe.total_time as number,
      servings: recipe.servings as number,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      recommendations: recipe.recommendations,
      origin: recipe.origin,
      visibility: recipe.visibility,
      image: recipe.image,
      author_name: recipe.author.name,
      author_image: recipe.author.image,
      author_id: recipe.authorId,
      favorite: true,
    }));
    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};
