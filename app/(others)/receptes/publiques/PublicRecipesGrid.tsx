"use server";

import { getPublicRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

const PublicRecipesGrid = async () => {
  const recipesResponse = await getPublicRecipes();
  const recipes = recipesResponse.recipes;

  if (!recipes || recipes.length === 0) {
    return null;
  }
  return <RecipesGrid recipes={recipes} />;
};

export default PublicRecipesGrid;
