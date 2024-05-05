"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesPaginationResponse } from "./TYPES";

//------------------ DESCRIPTION ------------------:

// - Get all AI recipes

//------------------ RESPONSE TYPE ------------------:

// TYPE: recipesPaginationResponse = { recipes: recipeAndAuthor[] , total: number } | error

//------------------ ACTION ------------------:

export const getAIRecipes = async (
  page: number,
  take: number
): Promise<recipesPaginationResponse> => {
  try {
    // Get current user if exists
    const user = await currentUser();

    // Get all public recipes
    const recipes = await db.recipe.findMany({
      where: {
        visibility: "AI",
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
      orderBy: {
        title: "asc",
      },
      take: take,
      skip: (page - 1) * take,
    });

    // Get total number of public recipes
    const total = await db.recipe.count({
      where: {
        visibility: "AI",
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
      favorite: user ? recipe.favoritedBy.some((f) => f.id === user.id) : false,
    }));

    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};
