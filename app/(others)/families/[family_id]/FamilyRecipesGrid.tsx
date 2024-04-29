"use server";

import { getFamilyRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

interface FamilyRecipesGridProps {
  familyId: string;
}

const FamilyRecipesGrid: React.FC<FamilyRecipesGridProps> = async ({
  familyId,
}) => {
  // Get family recipes
  const recipes = await getFamilyRecipes(familyId);
  if ("error" in recipes) throw new Error(recipes.error);

  // If there are no recipes, return null
  if (recipes.length === 0) return <p>No hi han receptes</p>; //TODO No recipes text

  // Return recipes grid
  return <RecipesGrid recipes={recipes} />;
};

export default FamilyRecipesGrid;
