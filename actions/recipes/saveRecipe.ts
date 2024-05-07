"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { RecipeSchema } from "@/schemas";
import { actionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import * as z from "zod";

//------------------ DESCRIPTION ------------------:

// - Save recipe

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const saveRecipe = async (
  values: z.infer<typeof RecipeSchema>,
  recipeId: string
): Promise<actionResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Validate fields
    const validatedFields = RecipeSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");
    const {
      title,
      prep_time,
      total_time,
      recommendations,
      origin,
      visibility,
      servings,
    } = validatedFields.data;

    // Get ingredients and steps
    const ingredients = validatedFields.data.ingredients.map(
      (ingredient) => ingredient.value
    );
    const steps = validatedFields.data.steps.map(
      (ingredient) => ingredient.value
    );

    // Check if a recipe with the same title already exists for the user
    const existingRecipe = await db.recipe.findFirst({
      where: {
        title: title,
        authorId: user.id,
        NOT: {
          id: recipeId,
        },
      },
    });
    if (existingRecipe) {
      throw new Error("show: Ja tens una recepta amb aquest títol!");
    }

    // Edit recipe
    const recipe = await db.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        title: title,
        prep_time: prep_time || null,
        total_time: total_time,
        servings: servings,
        ingredients: ingredients,
        steps: steps,
        recommendations: recommendations || null,
        origin: origin || null,
        visibility: visibility,
        draft: false,
      },
    });
    revalidatePath(`/receptes/${recipeId}`);
    return { success: "Recepta guardada amb èxit!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
