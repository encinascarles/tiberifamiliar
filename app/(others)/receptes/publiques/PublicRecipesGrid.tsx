"use server";

import { getPublicRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

const PublicRecipesGrid = async () => {
  const recipes = await getPublicRecipes();
  if ("error" in recipes) return null;

  if (!recipes || recipes.length === 0) return null;

  return <RecipesGrid recipes={recipes} />;
};

export default PublicRecipesGrid;
