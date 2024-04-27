"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DraftRecipeSchema, RecipeSchema } from "@/schemas";
import { actionResponse, draftRecipe, error, recipeAndAuthor } from "@/types";
import * as z from "zod";

//GLOBAL TYPES
type recipesResponse = recipeAndAuthor[] | error;

// UTIL: Get members from all families the user is from
const getUserFamiliesMembers = async (): Promise<string[]> => {
  // Get current user
  const user = await currentUser();
  if (!user?.id) throw new Error("Usuari no trobat!");

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

  //Return array of unique Ids
  return uniqueContacts;
};

// Save recipe
// TYPE: actionResponse = error | success;
export const saveRecipe = async (
  values: z.infer<typeof RecipeSchema>,
  recipeId: string
): Promise<actionResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Validate fields
  const validatedFields = RecipeSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Camps invàlids!" };
  const { title, prep_time, total_time, recommendations, origin, visibility } =
    validatedFields.data;

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
    return { error: "Ja existeix una recepta amb aquest títol!" };
  }

  // Edit recipe
  try {
    const recipe = await db.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        title: title,
        prep_time: prep_time,
        total_time: total_time,
        ingredients: ingredients,
        steps: steps,
        recommendations: recommendations,
        origin: origin,
        visibility: visibility,
        draft: false,
      },
    });
    return { success: "Recepta guardada amb èxit!" };
  } catch {
    return { error: "Error al guardar la recepta!" };
  }
};

// Save draft recipe
// TYPE: actionResponse = error | success;
export const saveDraftRecipe = async (
  values: z.infer<typeof DraftRecipeSchema>,
  recipeId: string
): Promise<actionResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Validate fields
  // const validatedFields = RecipeSchema.safeParse(values);
  // if (!validatedFields.success) return { error: "Camps invàlids!" };
  const { title, prep_time, total_time, recommendations, origin, visibility } =
    values;

  // Get ingredients and steps
  const ingredients = values.ingredients?.map((ingredient) => ingredient.value);
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
    return { error: "Ja existeix una recepta amb aquest títol!" };
  }

  // Edit recipe
  try {
    const recipe = await db.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        title: title,
        prep_time: prep_time,
        total_time: total_time,
        ingredients: ingredients,
        steps: steps,
        recommendations: recommendations,
        origin: origin,
        visibility: visibility,
        draft: true,
      },
    });
    return { success: "Recepta guardada amb èxit!" };
  } catch {
    return { error: "Error al guardar la recepta!" };
  }
};

// View all public recipes
export const getPublicRecipes = async (): Promise<recipesResponse> => {
  // Get all public recipes
  const recipes = await db.recipe.findMany({
    where: {
      visibility: "PUBLIC",
      draft: false,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
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
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
    visibility: recipe.visibility,
    image: recipe.image,
    author_name: recipe.author.name,
    author_image: recipe.author.image,
  }));

  return recipesToSend;
};

// View all personal recipes
export const getPersonalRecipes = async (): Promise<recipesResponse> => {
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };
  const recipes = await db.recipe.findMany({
    where: {
      authorId: user?.id,
      draft: false,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
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
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
    visibility: recipe.visibility,
    image: recipe.image,
    author_name: recipe.author.name,
    author_image: recipe.author.image,
  }));
  return recipesToSend;
};

// View all families recipes
export const getFamiliesRecipes = async (): Promise<recipesResponse> => {
  // Get all family members
  const users = await getUserFamiliesMembers();

  // Get all recipes from the family members
  const recipes = await db.recipe.findMany({
    where: {
      authorId: {
        in: users,
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
    },
  });

  // Prepare response
  const recipesToSend = recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title as string,
    prep_time: recipe.prep_time as number,
    total_time: recipe.total_time as number,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
    visibility: recipe.visibility,
    image: recipe.image,
    author_name: recipe.author.name,
    author_image: recipe.author.image,
  }));
  return recipesToSend;
};

//View all family recipes
export const getFamilyRecipes = async (
  familyId: string
): Promise<recipesResponse> => {
  // Check if the user is a member of the family
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };
  const member = await db.familyMembership.findFirst({
    where: {
      userId: user.id,
      familyId: familyId,
    },
  });
  if (!member) return { error: "No ets membre d'aquesta familia!" };

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
  if (!family) return { error: "Familia no trobada!" };

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
    },
  });

  // Prepare response
  const recipesToSend = recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title as string,
    prep_time: recipe.prep_time as number,
    total_time: recipe.total_time as number,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
    visibility: recipe.visibility,
    image: recipe.image,
    author_name: recipe.author.name,
    author_image: recipe.author.image,
  }));
  return recipesToSend;
};

// View all favorite recipes
export const getFavoriteRecipes = async (): Promise<recipesResponse> => {
  // Get favorite recipes
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  const fullUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      favoriteRecipes: {
        where: {
          draft: false,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
  if (!fullUser) return { error: "Usuari no trobat!" };

  // Prepare response
  const recipesToSend = fullUser.favoriteRecipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title as string,
    prep_time: recipe.prep_time as number,
    total_time: recipe.total_time as number,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
    visibility: recipe.visibility,
    image: recipe.image,
    author_name: recipe.author.name,
    author_image: recipe.author.image,
  }));

  return recipesToSend;
};

// View recipe
type recipeResponse = recipeAndAuthor | error;
export const getRecipe = async (id: string): Promise<recipeResponse> => {
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

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
    },
  });
  if (!recipe) return { error: "Recepta no trobada!" };

  // Prepare response
  const recipesToSend = {
    id: recipe.id,
    title: recipe.title as string,
    prep_time: recipe.prep_time as number,
    total_time: recipe.total_time as number,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
    visibility: recipe.visibility,
    image: recipe.image,
    author_name: recipe.author.name,
    author_image: recipe.author.image,
  };

  // Accept if user is the author
  if (recipe.author.id === user.id) return recipesToSend;

  // Accept if recipe is public
  if (recipe.visibility === "PUBLIC") return recipesToSend;

  // Reject if recipe is private and user is not the author
  if (recipe.visibility === "PRIVATE") return { error: "Recepta privada!" };
  // Accept if recipe is family and user is a member of a common family
  else {
    const contacts = await getUserFamiliesMembers();
    if (contacts.includes(recipe.author.id)) return recipesToSend;
    return { error: "Recepta privada!" };
  }
};

// Get draft recipe
type draftRecipeResponse = draftRecipe | error;
export const getDraftRecipe = async (
  id: string
): Promise<draftRecipeResponse> => {
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  const recipe = await db.recipe.findUnique({
    where: {
      id: id,
    },
  });
  if (!recipe) return { error: "Recepta no trobada!" };

  // Prepare response
  const recipesToSend = {
    id: recipe.id,
    title: recipe.title,
    prep_time: recipe.prep_time,
    total_time: recipe.total_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
    visibility: recipe.visibility,
    image: recipe.image,
  };

  // Accept if user is the author
  if (recipe.authorId !== user.id)
    return { error: "No autoritzat per veure la recepta" };
  return recipesToSend;
};

// Is favorite recipe
type isFavoriteResponse = { favorite: boolean } | error;
export const isFavoriteRecipe = async (
  recipeId: string
): Promise<isFavoriteResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Check if the recipe is a favorite
  const favorite = await db.user.findFirst({
    where: {
      id: user.id,
      favoriteRecipes: {
        some: {
          id: recipeId,
        },
      },
    },
  });
  if (favorite) return { favorite: true };
  return { favorite: false };
};

// Toggle favorite recipe
type toggleFavoriteRecipe = { favorite: boolean } | error;
export const toggleFavoriteRecipe = async (
  recipeId: string
): Promise<toggleFavoriteRecipe> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Check if the recipe is a favorite
  const favorite = await db.user.findFirst({
    where: {
      id: user.id,
      favoriteRecipes: {
        some: {
          id: recipeId,
        },
      },
    },
  });

  // Add or remove from favorites
  if (favorite) {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        favoriteRecipes: {
          disconnect: {
            id: recipeId,
          },
        },
      },
    });
    return { favorite: false };
  } else {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        favoriteRecipes: {
          connect: {
            id: recipeId,
          },
        },
      },
    });
    return { favorite: true };
  }
};

export const createEmptyRecipe = async () => {
  // Get current user
  const user = await currentUser();
  if (!user?.id) return { error: "Usuari no trobat!" };

  // Create empty recipe
  const recipe = await db.recipe.create({
    data: {
      authorId: user.id,
      draft: true,
    },
  });
  if (!recipe) return { error: "Error al crear la recepta!" };
  return { id: recipe.id };
};

// Edit recipe

// Delete recipe

// View all families recipes
