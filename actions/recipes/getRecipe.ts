"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error, recipeAndAuthor } from "@/types";
import { getUserFamiliesMembers } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Get recipe

//------------------ RESPONSE TYPE ------------------:

type recipeResponse = recipeAndAuthor | error;

//------------------ ACTION ------------------:

export const getRecipe = async (id: string): Promise<recipeResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get recipe
    const recipe = await db.recipe.findUnique({
      where: {
        id: id,
        draft: false,
      },
      include: {
        author: {
          select: {
            id: true,
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
    });
    if (!recipe) throw new Error("show: Recepta no trobada!");

    // Prepare response
    const recipesToSend = {
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
      favorite: recipe.favoritedBy.some((f) => f.id === user.id),
      created_at: recipe.createdAt,
      updated_at: recipe.updatedAt,
    };

    // Accept if user is the author
    if (recipe.author.id === user.id) return recipesToSend;

    // Accept if recipe is public or AI
    if (recipe.visibility === "PUBLIC" || recipe.visibility === "AI")
      return recipesToSend;

    // Reject if recipe is private and user is not the author
    if (recipe.visibility === "PRIVATE")
      throw new Error("show: Recepta privada!");
    // Accept if recipe is FAMILY and user is a member of a common family
    const { users } = await getUserFamiliesMembers();
    if (users.includes(recipe.author.id)) return recipesToSend;
    throw new Error("show: Recepta privada!");
  } catch (e: any) {
    return errorHandler(e);
  }
};
