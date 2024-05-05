"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { DraftRecipeSchema } from "@/schemas";
import { actionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import * as z from "zod";

//------------------ DESCRIPTION ------------------:

// - Save draft recipe

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export const saveDraftRecipe = async (
  values: z.infer<typeof DraftRecipeSchema>,
  recipeId: string
): Promise<actionResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Validate fields
    // TODO: Check if the fields are valid
    // const validatedFields = RecipeSchema.safeParse(values);
    // if (!validatedFields.success) return { error: "Camps invàlids!" };
    const {
      title,
      prep_time,
      total_time,
      recommendations,
      origin,
      visibility,
      servings,
    } = values;

    // Get ingredients and steps
    const ingredients = values.ingredients?.map(
      (ingredient) => ingredient.value
    );
    const steps = values.steps?.map((ingredient) => ingredient.value);

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
      throw new Error("show: Ja existeix una recepta amb aquest títol!");
    }

    // Edit recipe
    const recipe = await db.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        title: title,
        prep_time: prep_time,
        total_time: total_time,
        servings: servings,
        ingredients: ingredients,
        steps: steps,
        recommendations: recommendations,
        origin: origin,
        visibility: visibility,
        draft: true,
      },
    });
    revalidatePath("/receptes/${recipeId}");
    return { success: "Recepta guardada amb èxit!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
