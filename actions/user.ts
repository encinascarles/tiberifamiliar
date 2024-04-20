"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// View all public recipes
export const getPersonalRecipes = async () => {
  const user = await currentUser();
  const good_user = await db.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      recipes: true,
    },
  });
  console.log(good_user);
  return good_user?.recipes;
};
