import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Recipe } from "@prisma/client";

//------------------ UTILS ------------------:

// - Get all user contacts (family members)
export type getUserFamilyMembersResponse = {
  users: string[];
  userId: string | undefined;
};
export const getUserFamiliesMembers =
  async (): Promise<getUserFamilyMembersResponse> => {
    // Get current user
    const user = await safeGetSessionUser();

    // Get all families the user is from with its members
    const families = await db.family.findMany({
      where: {
        members: {
          some: {
            userId: user?.id,
          },
        },
      },
      include: {
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Prepare response
    const contacts = families.flatMap((family) =>
      family.members.map((member) => member.userId)
    );
    const uniqueContacts = Array.from(new Set(contacts));

    // Return array of unique Ids
    return { users: uniqueContacts, userId: user.id };
  };

// - Prepare recipe response
export const prepareRecipeResponse = (
  recipe: {
    author: {
      name: string;
      image: string | null;
    };
    favoritedBy: {
      id: string;
    }[];
  } & Recipe,
  userId: string | undefined
) => {
  return {
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
    favorite: userId
      ? recipe.favoritedBy
        ? recipe.favoritedBy.some((f: any) => f.id === userId)
        : false
      : false,
  };
};
