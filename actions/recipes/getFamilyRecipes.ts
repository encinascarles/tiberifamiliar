"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesResponse } from "./TYPES";
import { checkUserFamilyMember } from "../families/UTILS";

//------------------ DESCRIPTION ------------------:

// - Get all family recipes

//------------------ RESPONSE TYPE ------------------:

// TYPE: recipesResponse = recipeAndAuthor[] | error;

//------------------ ACTION ------------------:

export const getFamilyRecipes = async (
  familyId: string
): Promise<recipesResponse> => {
  try {
    // Check if the user is a member of the family
    const { user } = await checkUserFamilyMember(familyId);

    // Get all recipes from the family
    const family = await db.family.findUnique({
      where: {
        id: familyId,
      },
      include: {
        members: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!family) throw new Error("show: Familia no trobada!");

    // Get all recipes from the family members
    const familyMembers = family.members.map((member) => member.userId);
    const recipes = await db.recipe.findMany({
      where: {
        authorId: {
          in: familyMembers,
        },
        draft: false,
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
      favorite: recipe.favoritedBy.some((f) => f.id === user.id),
    }));
    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};
