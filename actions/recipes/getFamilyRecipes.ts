"use server";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { recipesResponse } from "./TYPES";
import { checkUserFamilyMember } from "../families/UTILS";
import { prepareRecipeResponse } from "./UTILS";

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
          not: user.id,
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
    const recipesToSend = recipes.map((recipe) =>
      prepareRecipeResponse(recipe, user.id)
    );
    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};
