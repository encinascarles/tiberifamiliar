"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { error, recipeAndAuthor } from "@/types";
import { getUserFamiliesMembers, prepareRecipeResponse } from "./UTILS";

//------------------ DESCRIPTION ------------------:

// - Search recipes

//------------------ RESPONSE TYPE ------------------:

export interface position {
  place: "personal" | "families" | "public" | "ai" | "end";
  num: number;
}
export type searchRecipesResponse =
  | {
      recipes: {
        personal: recipeAndAuthor[];
        families: recipeAndAuthor[];
        public: recipeAndAuthor[];
        ai: recipeAndAuthor[];
      };
      position: position;
      done: string[];
    }
  | error;

//------------------ ACTION ------------------:

export const searchRecipes = async ({
  take,
  query,
  done,
  position,
}: {
  take: number;
  query?: string;
  done?: string[];
  position?: position;
}): Promise<searchRecipesResponse> => {
  if (!query)
    return {
      recipes: { personal: [], families: [], public: [], ai: [] },
      position: { place: "end", num: 0 },
      done: [],
    };
  try {
    // Get current user
    const user = await currentUser();

    let newPosition: position;
    if (position) {
      newPosition = position;
    } else {
      if (user?.id) {
        newPosition = { place: "personal", num: 0 };
      } else {
        newPosition = { place: "public", num: 0 };
      }
    }

    let batchCount = 0;

    let personalRecipesToSend: recipeAndAuthor[] = [];
    let familiesRecipesToSend: recipeAndAuthor[] = [];
    let publicRecipesToSend: recipeAndAuthor[] = [];
    let aiRecipesToSend: recipeAndAuthor[] = [];

    let doneRecipes: string[] = done ? done : [];

    // Search personal recipes
    if (user?.id && newPosition.place === "personal") {
      const personalRecipes = await db.recipe.findMany({
        where: {
          id: {
            notIn: doneRecipes,
          },
          draft: false,
          authorId: user.id,
          title: {
            search: query.replace(/\s+/g, " | "),
          },
        },
        orderBy: {
          _relevance: {
            fields: ["title"],
            search: query.replace(/\s+/g, " & "),
            sort: "desc",
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
        skip: newPosition.num,
      });

      // Prepare response
      personalRecipesToSend = personalRecipes.map((recipe) => {
        doneRecipes.push(recipe.id);
        return prepareRecipeResponse(recipe, user.id);
      });

      batchCount += personalRecipes.length;
      if (batchCount < take) {
        newPosition = { place: "families", num: 0 };
      } else {
        newPosition = {
          place: "personal",
          num: newPosition.num + personalRecipes.length,
        };
      }
    }

    // Search families recipes
    if (user?.id && newPosition?.place === "families") {
      // Get all family members
      const { users } = await getUserFamiliesMembers();

      // Get all public or family recipes from the family members
      const familiesRecipes = await db.recipe.findMany({
        where: {
          id: {
            notIn: doneRecipes,
          },
          authorId: {
            in: users,
          },
          draft: false,
          NOT: {
            visibility: "PRIVATE",
          },
          title: {
            search: query.replace(/\s+/g, " | "),
          },
        },
        orderBy: {
          _relevance: {
            fields: ["title"],
            search: query.replace(/\s+/g, " & "),
            sort: "desc",
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
        take: take - batchCount,
        skip: newPosition.num,
      });

      // Prepare response
      familiesRecipesToSend = familiesRecipes.map((recipe) => {
        doneRecipes.push(recipe.id);
        return prepareRecipeResponse(recipe, user.id);
      });

      batchCount += familiesRecipes.length;
      if (batchCount < take) {
        newPosition = { place: "public", num: 0 };
      } else {
        newPosition = {
          place: "families",
          num: newPosition.num + familiesRecipes.length,
        };
      }
    }

    // Search public recipes
    if (newPosition?.place === "public") {
      const publicRecipes = await db.recipe.findMany({
        where: {
          id: {
            notIn: doneRecipes,
          },
          draft: false,
          visibility: "PUBLIC",
          title: {
            search: query.replace(/\s+/g, " | "),
          },
        },
        orderBy: {
          _relevance: {
            fields: ["title"],
            search: query.replace(/\s+/g, " & "),
            sort: "desc",
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
        take: take - batchCount,
        skip: newPosition.num,
      });

      // Prepare response
      publicRecipesToSend = publicRecipes.map((recipe) => {
        doneRecipes.push(recipe.id);
        return prepareRecipeResponse(recipe, user?.id);
      });

      batchCount += publicRecipes.length;
      if (batchCount < take) {
        newPosition = { place: "ai", num: 0 };
      } else {
        newPosition = {
          place: "public",
          num: newPosition.num + publicRecipes.length,
        };
      }
    }

    // Search ai recipes
    if (newPosition?.place === "ai") {
      const aiRecipes = await db.recipe.findMany({
        where: {
          id: {
            notIn: doneRecipes,
          },
          draft: false,
          visibility: "AI",
          title: {
            search: query.replace(/\s+/g, " | "),
          },
        },
        orderBy: {
          _relevance: {
            fields: ["title"],
            search: query.replace(/\s+/g, " & "),
            sort: "desc",
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
        take: take - batchCount,
        skip: newPosition.num,
      });

      // Prepare response
      aiRecipesToSend = aiRecipes.map((recipe) => {
        doneRecipes.push(recipe.id);
        return prepareRecipeResponse(recipe, user?.id);
      });

      batchCount += aiRecipes.length;
      if (batchCount < take) {
        newPosition = { place: "end", num: 0 };
      } else {
        newPosition = {
          place: "ai",
          num: newPosition.num + aiRecipes.length,
        };
      }
    }
    return {
      recipes: {
        personal: personalRecipesToSend,
        families: familiesRecipesToSend,
        public: publicRecipesToSend,
        ai: aiRecipesToSend,
      },
      position: newPosition,
      done: doneRecipes,
    };
  } catch (e: any) {
    return errorHandler(e);
  }
};
