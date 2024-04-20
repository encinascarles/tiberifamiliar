"use server";
import { currentUser } from "../lib/auth";
import { db } from "../lib/db";
import * as z from "zod";
import { RecipeSchema } from "../schemas";

// Create new recipe
export const createRecipe = async (values: z.infer<typeof RecipeSchema>) => {
  // Validate fields
  const validatedFields = RecipeSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Camps invàlids!" };

  // Get fields
  const {
    title,
    prep_time,
    total_time,
    recommendations,
    origin,
    image,
    visibility,
  } = validatedFields.data;

  const ingredients = validatedFields.data.ingredients.map(
    (ingredient) => ingredient.value
  );
  const steps = validatedFields.data.steps.map(
    (ingredient) => ingredient.value
  );

  // Get current user
  const user = await currentUser();

  if (!user) return { error: "Usuari no trobat!" };

  // Check if a recipe with the same title already exists for the user
  const existingRecipe = await db.recipe.findFirst({
    where: {
      title: title,
      authorId: user.id,
    },
  });

  if (existingRecipe) {
    return { error: "Ja existeix una recepta amb aquest títol!" };
  }

  // Create recipe
  try {
    const recipe = await db.recipe.create({
      data: {
        title,
        prep_time,
        total_time,
        ingredients,
        steps,
        recommendations,
        origin,
        image,
        visibility,
        author: {
          connect: { id: user.id },
        },
      },
    });
    return { success: "Recepta creada amb èxit!", id: recipe.id };
  } catch {
    return { error: "Error al crear la recepta!" };
  }
};

// View all public recipes
export const getPublicRecipes = async () => {
  return await db.recipe.findMany({
    where: {
      visibility: "PUBLIC",
    },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });
};

export const provapene = async () => {
  console.log("prova");
  const user = await currentUser();
  console.log(user);
};

// Edit recipe

// Delete recipe

// View recipe

// View all families recipes
