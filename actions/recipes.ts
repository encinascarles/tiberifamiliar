"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";
import { RecipeSchema } from "@/schemas";

// Get members from all families the user is from
const getUserFamiliesMembers = async () => {
  const user = await currentUser();
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
  const contacts = families.flatMap((family) =>
    family.members.map((member) => member.userId)
  );
  const uniqueContacts = Array.from(new Set(contacts));
  return uniqueContacts;
};

// Create new recipe
export const createRecipe = async (values: z.infer<typeof RecipeSchema>) => {
  // Validate fields
  const validatedFields = RecipeSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Camps invàlids!" };

  // Get fields
  const {
    title,
    prep_time,
    total_time,
    recommendations,
    origin,
    image,
    visibility,
  } = validatedFields.data;

  const ingredients = validatedFields.data.ingredients.map(
    (ingredient) => ingredient.value
  );
  const steps = validatedFields.data.steps.map(
    (ingredient) => ingredient.value
  );

  // Get current user
  const user = await currentUser();

  if (!user) return { error: "Usuari no trobat!" };

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
export const getPublicRecipes = async () => {
  return await db.recipe.findMany({
    where: {
      visibility: "PUBLIC",
    },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });
};

// View all personal recipes
export const getPersonalRecipes = async () => {
  const user = await currentUser();
  const good_user = await db.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      recipes: {
        include: {
          author: {
            select: {
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return good_user?.recipes;
};

// View all families recipes
export const getFamiliesRecipes = async () => {
  const users = await getUserFamiliesMembers();
  const recipes = await db.recipe.findMany({
    where: {
      authorId: {
        in: users,
      },
    },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });
  return recipes;
};

// View recipe
export const getRecipe = async (id: string) => {
  const user = await currentUser();
  const recipe = await db.recipe.findUnique({
    where: {
      id: id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  if (!recipe) return { error: "Recepta no trobada!" };
  if (recipe.author.id === user?.id) return { recipe };
  if (recipe.visibility === "PUBLIC") return { recipe };
  if (recipe.visibility === "PRIVATE") return { error: "Recepta privada!" };
  if (recipe.visibility === "FAMILY") {
    const contacts = await getUserFamiliesMembers();
    if (contacts.includes(recipe.author.id)) return { recipe };
    return { error: "Recepta privada!" };
  }
  return { error: "Error al carregar la recepta!" };
};

// Edit recipe

// Delete recipe

// View all families recipes
