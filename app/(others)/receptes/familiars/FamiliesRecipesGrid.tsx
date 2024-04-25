"use server";

import { getFamiliesRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

const FamiliesRecipesGrid = async () => {
  const recipesResponse = await getFamiliesRecipes();
  const recipes = recipesResponse?.recipes;

  if (!recipes || recipes.length === 0) {
    return null;
  }

  return <RecipesGrid recipes={recipes} />;
};

export default FamiliesRecipesGrid;
