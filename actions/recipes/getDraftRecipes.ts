"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesResponse } from "./TYPES";

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
    const recipesToSend = recipes.map((recipe) => ({
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
      favorite: false,
      updated_at: recipe.updatedAt,
    }));
    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};
