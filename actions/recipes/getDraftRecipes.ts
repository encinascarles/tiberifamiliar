"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error, recipe } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Get all draft recipes

//------------------ RESPONSE TYPE ------------------:

export type draftResponse = recipe[] | error;

//------------------ ACTION ------------------:

export const getDraftRecipes = async (): Promise<draftResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get all draft recipes from the user
    const recipes = await db.recipe.findMany({
      where: {
        authorId: user?.id,
        draft: true,
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
      created_at: recipe.createdAt,
      updated_at: recipe.updatedAt,
    }));

    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};
