"use server";

import { getFavoriteRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/recipes/RecipesGrid";

const FavoriteRecipesGrid = async () => {
  const recipes = await getFavoriteRecipes();
  if ("error" in recipes) return null;

  if (recipes.length === 0) return null;

  return <RecipesGrid recipes={recipes} />;
};

export default FavoriteRecipesGrid;
