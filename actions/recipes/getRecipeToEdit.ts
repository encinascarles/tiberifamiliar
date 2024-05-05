"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { draftRecipe, error } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Get recipe to edit

//------------------ RESPONSE TYPE ------------------:

type getRecipeToEditResponse = draftRecipe | error;

//------------------ ACTION ------------------:

export const getRecipeToEdit = async (
  id: string
): Promise<getRecipeToEditResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get recipe
    const recipe = await db.recipe.findUnique({
      where: {
        id: id,
      },
    });
    if (!recipe) throw new Error("show: Recepta no trobada!");

    // If user is not the author, reject
    if (recipe.authorId !== user.id)
      throw new Error("show: No autoritzat per veure la recepta");

    // Prepare response
    const recipesToSend = {
      id: recipe.id,
      title: recipe.title,
      prep_time: recipe.prep_time,
      total_time: recipe.total_time,
      servings: recipe.servings as number,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      recommendations: recipe.recommendations,
      origin: recipe.origin,
      visibility: recipe.visibility,
      image: recipe.image,
    };
    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};
