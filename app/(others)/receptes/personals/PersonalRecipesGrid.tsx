"use server";

import { getPersonalRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

const PersonalRecipesGrid = async () => {
  const recipesResponse = await getPersonalRecipes();
  const recipes = recipesResponse?.recipes;

  if (!recipes || recipes.length === 0) {
    return null;
  }
  return <RecipesGrid recipes={recipes} addRecipe personal />;
};

export default PersonalRecipesGrid;
