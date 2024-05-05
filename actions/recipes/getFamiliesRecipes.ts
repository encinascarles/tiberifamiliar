"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesPaginationResponse } from "./TYPES";
import { getUserFamiliesMembers } from "./UTILS";

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
    const recipesToSend = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title as string, // non draft recipes will never have a null title ot times
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
      favorite: recipe.favoritedBy.some((f) => f.id === userId),
    }));

    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};
