"use server";

import { getDraftRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

const DraftRecipesGrid = async () => {
  const recipes = await getDraftRecipes();
  if ("error" in recipes) return null;

  if (recipes.length === 0) return null;

  return <RecipesGrid recipes={recipes} personal draft />;
};

export default DraftRecipesGrid;
