"use server";
import { MAX_RECIPE_IMAGE_UPLOAD_SIZE } from "@/config";
import { currentUser, safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { deleteFile, getUploadFileUrl } from "@/lib/s3";
import { DraftRecipeSchema, RecipeSchema } from "@/schemas";
import {
  actionResponse,
  draftRecipe,
  error,
  recipe,
  recipeAndAuthor,
} from "@/types";
import * as z from "zod";
import { checkUserFamilyMember } from "./families";
import { revalidatePath } from "next/cache";

//--------------- GLOBAL TYPES --------------:

export type recipesResponse = recipeAndAuthor[] | error;
export type getPaginationRecipesResponse =
  | {
      recipes: recipeAndAuthor[];
      total: number;
    }
  | error;

//------------------ UTILS ------------------:

// - Get all user contacts (family members)
type getUserFamilyMembersResponse = {
  users: string[];
  userId: string | undefined;
};
const getUserFamiliesMembers =
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

//------------------ ACTIONS ------------------:

// - Save recipe
// TYPE: actionResponse = error | success;
export const saveRecipe = async (
  values: z.infer<typeof RecipeSchema>,
  recipeId: string
): Promise<actionResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Validate fields
    const validatedFields = RecipeSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("show: Camps invàlids!");
    const {
      title,
      prep_time,
      total_time,
      recommendations,
      origin,
      visibility,
      servings,
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
        NOT: {
          id: recipeId,
        },
      },
    });
    if (existingRecipe) {
      throw new Error("show: Ja existeix una recepta amb aquest títol!");
    }

    // Edit recipe
    const recipe = await db.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        title: title,
        prep_time: prep_time,
        total_time: total_time,
        servings: servings,
        ingredients: ingredients,
        steps: steps,
        recommendations: recommendations,
        origin: origin,
        visibility: visibility,
        draft: false,
      },
    });
    revalidatePath("/receptes/${recipeId}");
    return { success: "Recepta guardada amb èxit!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Save draft recipe
// TYPE: actionResponse = error | success;
export const saveDraftRecipe = async (
  values: z.infer<typeof DraftRecipeSchema>,
  recipeId: string
): Promise<actionResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Validate fields
    // TODO: Check if the fields are valid
    // const validatedFields = RecipeSchema.safeParse(values);
    // if (!validatedFields.success) return { error: "Camps invàlids!" };
    const {
      title,
      prep_time,
      total_time,
      recommendations,
      origin,
      visibility,
      servings,
    } = values;

    // Get ingredients and steps
    const ingredients = values.ingredients?.map(
      (ingredient) => ingredient.value
    );
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
      throw new Error("show: Ja existeix una recepta amb aquest títol!");
    }

    // Edit recipe
    const recipe = await db.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        title: title,
        prep_time: prep_time,
        total_time: total_time,
        servings: servings,
        ingredients: ingredients,
        steps: steps,
        recommendations: recommendations,
        origin: origin,
        visibility: visibility,
        draft: true,
      },
    });
    revalidatePath("/receptes/${recipeId}");
    return { success: "Recepta guardada amb èxit!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Get all public recipes
// TYPE: recipesResponse = recipeAndAuthor[] | error;
export const getPublicRecipes = async (): Promise<recipesResponse> => {
  try {
    // Get current user if exists
    const user = await currentUser();

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
      favorite: user ? recipe.favoritedBy.some((f) => f.id === user.id) : false,
    }));

    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Get all personal recipes
// TYPE: recipesResponse = recipeAndAuthor[] | error;
export const getPersonalRecipes = async (
  page: number,
  take: number
): Promise<getPaginationRecipesResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get all recipes from the user that are not drafts
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
        authorId: user?.id,
        draft: false,
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
    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Get all families recipes
// TYPE: recipesResponse = recipeAndAuthor[] | error;
export const getFamiliesRecipes = async (
  page: number,
  take: number
): Promise<getPaginationRecipesResponse> => {
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

// - Get all family recipes
// TYPE: recipesResponse = recipeAndAuthor[] | error;
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

// - Get all favorite recipes
// TYPE: recipesResponse = recipeAndAuthor[] | error;
export const getFavoriteRecipes = async (
  page: number,
  take: number
): Promise<getPaginationRecipesResponse> => {
  try {
    // Get favorite recipes
    const user = await safeGetSessionUser();

    // Get all favorite recipes from the user
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
          take: take,
          skip: (page - 1) * take,
        },
      },
    });
    if (!fullUser) throw new Error("show: Usuari no trobat!");

    // Count the user total favorite recipes
    const total = await db.recipe.count({
      where: {
        favoritedBy: {
          some: {
            id: user.id,
          },
        },
      },
    });

    // Prepare response
    const recipesToSend = fullUser.favoriteRecipes.map((recipe) => ({
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
      favorite: true,
    }));
    return { recipes: recipesToSend, total };
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Get all draft recipes
// TYPE: recipesResponse = recipeAndAuthor[] | error;
export const getDraftRecipes = async (): Promise<recipesResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get all draft recipes from the user
    const recipes = await db.recipe.findMany({
      where: {
        authorId: user?.id,
        draft: true,
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
      favorite: false,
      updated_at: recipe.updatedAt,
    }));
    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Get all AI recipes
export const getAIRecipes = async (
  page: number,
  take: number
): Promise<getPaginationRecipesResponse> => {
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

// - Get recipe
type recipeResponse = recipeAndAuthor | error;
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

// - Get recipe to edit
type getRecipeToEditResponse = draftRecipe | error;
export const getRecipeToEdit = async (
  id: string
): Promise<getRecipeToEditResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Get recipe
    const recipe = await db.recipe.findUnique({
      where: {
        id: id,
      },
    });
    if (!recipe) throw new Error("show: Recepta no trobada!");

    // If user is not the author, reject
    if (recipe.authorId !== user.id)
      throw new Error("show: No autoritzat per veure la recepta");

    // Prepare response
    const recipesToSend = {
      id: recipe.id,
      title: recipe.title,
      prep_time: recipe.prep_time,
      total_time: recipe.total_time,
      servings: recipe.servings as number,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      recommendations: recipe.recommendations,
      origin: recipe.origin,
      visibility: recipe.visibility,
      image: recipe.image,
    };
    return recipesToSend;
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Toggle favorite recipe
type toggleFavoriteRecipe = { favorite: boolean } | error;
export const toggleFavoriteRecipe = async (
  recipeId: string
): Promise<toggleFavoriteRecipe> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

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
      revalidatePath("/receptes/${recipeId}");
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
      revalidatePath("/receptes/${recipeId}");
      return { favorite: true };
    }
  } catch (e: any) {
    return errorHandler(e);
  }
};

// - Create empty recipe
type createEmptyRecipeResponse = { id: string } | error;
export const createEmptyRecipe =
  async (): Promise<createEmptyRecipeResponse> => {
    try {
      // Get current user
      const user = await safeGetSessionUser();
      // Create empty recipe
      const recipe = await db.recipe.create({
        data: {
          authorId: user.id as string,
          draft: true,
        },
      });
      if (!recipe) throw new Error("show: Error al crear la recepta!");
      return { id: recipe.id };
    } catch (e: any) {
      return errorHandler(e);
    }
  };

// - Provide a signed URL for the client to upload a recipe image and update the recipe with the new image
export type getRecipeSignedImageURLResponse =
  | { uploadUrl: string; image: string }
  | error;
export async function getRecipeSignedImageURL(
  type: string,
  size: number,
  checksum: string,
  recipeId: string
): Promise<getRecipeSignedImageURLResponse> {
  try {
    // Check if the file is an image
    if (!type.startsWith("image/")) {
      throw new Error("show: Extensió de l'arxiu invalida");
    }

    // Check if the file is too big
    if (size > MAX_RECIPE_IMAGE_UPLOAD_SIZE * 1024 * 1024) {
      throw new Error("show: La imatge ha d'ocupar menys de 3MB");
    }

    // Get current user
    const user = await safeGetSessionUser();

    // Get signed URL
    const { signedURL, fileURL } = await getUploadFileUrl({
      type,
      size,
      checksum,
      metadata: {
        recipeId: recipeId,
      },
    });

    // Update the recipe with the new image and delete the old one
    await db.$transaction(async () => {
      // Make sure the user is the owner of the recipe
      const recipe = await db.recipe.findUnique({
        where: { id: recipeId, authorId: user.id },
      });
      if (!recipe) throw new Error("show: Recepta no trobada");

      // Check if there is already an image for this recipe and delete it
      if (recipe.image) {
        await deleteFile(recipe.image);
      }
      await db.recipe.update({
        where: { id: recipeId },
        data: {
          image: fileURL,
        },
      });
    });
    return { uploadUrl: signedURL, image: fileURL };
  } catch (e: any) {
    return errorHandler(e);
  }
}

// - Delete recipe image
// TYPE: actionResponse = error | success;
export async function deleteRecipeImage(url: string): Promise<actionResponse> {
  try {
    // Get user
    const user = await safeGetSessionUser();

    await db.$transaction(async () => {
      // Make sure the user owns the image
      const recipe = await db.recipe.findFirst({
        where: { image: url },
      });
      if (!recipe) throw new Error("show: Imatge no trobada");
      if (recipe.authorId !== user.id)
        throw new Error("show: No autoritzat per eliminar la imatge");

      // Delete the image from the database
      await db.recipe.update({
        where: { id: recipe.id },
        data: {
          image: null,
        },
      });

      // Delete the image from the S3 bucket
      await deleteFile(url);
    });
    return { success: "Imatge eliminada amb èxit" };
  } catch (e: any) {
    return errorHandler(e);
  }
}

// - Delete recipe
// TYPE: actionResponse = error | success;
export const deleteRecipe = async (
  recipeId: string
): Promise<actionResponse> => {
  try {
    // Get current user
    const user = await safeGetSessionUser();

    // Delete the recipe
    await db.recipe.delete({
      where: {
        id: recipeId,
        authorId: user.id,
      },
    });

    // Revalidate the recipes page and the users personal recipes page

    return { success: "Recepta eliminada amb èxit!" };
  } catch (e: any) {
    return errorHandler(e);
  }
};
