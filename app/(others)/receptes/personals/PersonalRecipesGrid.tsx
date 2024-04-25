"use server";

import { getPersonalRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

const PersonalRecipesGrid = async () => {
  const recipes = await getPersonalRecipes();
  if ("error" in recipes) return null;

  if (recipes.length === 0) return null;

  return <RecipesGrid recipes={recipes} addRecipe personal />;
};

export default PersonalRecipesGrid;
