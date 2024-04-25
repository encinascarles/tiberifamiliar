"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";
import { RecipeSchema } from "@/schemas";
import { recipe, error, recipeAndAuthor } from "@/types";

//TYPES
type recipesResponse = recipeAndAuthor[] | error;

type createRecipeResponse =
  | error
  | {
      success: string;
      id: string;
    };

type recipeResponse = recipeAndAuthor | error;

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

// Create new recipe
export const createRecipe = async (
  values: z.infer<typeof RecipeSchema>
): Promise<createRecipeResponse> => {
  // Get current user
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  // Validate fields
  const validatedFields = RecipeSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Camps invàlids!" };
  const {
    title,
    prep_time,
    total_time,
    recommendations,
    origin,
    image,
    visibility,
  } = validatedFields.data;

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
export const getPublicRecipes = async (): Promise<recipesResponse> => {
  // Get all public recipes
  const recipes = await db.recipe.findMany({
    where: {
      visibility: "PUBLIC",
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
    title: recipe.title,
    prep_time: recipe.prep_time,
    total_time: recipe.total_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
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
    title: recipe.title,
    prep_time: recipe.prep_time,
    total_time: recipe.total_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
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
    title: recipe.title,
    prep_time: recipe.prep_time,
    total_time: recipe.total_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
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
  // Check if the family exists
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
  const familyMembers = family.members.map((member) => member.userId);
  const recipes = await db.recipe.findMany({
    where: {
      authorId: {
        in: familyMembers,
      },
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
    title: recipe.title,
    prep_time: recipe.prep_time,
    total_time: recipe.total_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
    image: recipe.image,
    author_name: recipe.author.name,
    author_image: recipe.author.image,
  }));
  return recipesToSend;
};

// View recipe
export const getRecipe = async (id: string): Promise<recipeResponse> => {
  const user = await currentUser();
  if (!user) return { error: "Usuari no trobat!" };

  const recipe = await db.recipe.findUnique({
    where: {
      id: id,
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
    title: recipe.title,
    prep_time: recipe.prep_time,
    total_time: recipe.total_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    recommendations: recipe.recommendations,
    origin: recipe.origin,
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

// Edit recipe

// Delete recipe

// View all families recipes
