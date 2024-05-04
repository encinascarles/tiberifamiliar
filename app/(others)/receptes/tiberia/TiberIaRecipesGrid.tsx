"use server";

import { getAIRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

const TiberIaRecipesGrid = async () => {
  const recipes = await getAIRecipes();
  if ("error" in recipes) return null;

  if (!recipes || recipes.length === 0) return null;

  return <RecipesGrid recipes={recipes} />;
};

export default TiberIaRecipesGrid;
