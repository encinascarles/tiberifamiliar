"use server";

import { getFamiliesRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/recipes/RecipesGrid";

const FamiliesRecipesGrid = async () => {
  const recipes = await getFamiliesRecipes();
  if ("error" in recipes) return null;

  if (recipes.length === 0) return null;

  return <RecipesGrid recipes={recipes} />;
};

export default FamiliesRecipesGrid;
