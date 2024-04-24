"use server";

import { getFamilyRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";

interface FamilyRecipesGridProps {
  familyId: string;
}

const FamilyRecipesGrid: React.FC<FamilyRecipesGridProps> = async ({
  familyId,
}) => {
  const recipesResponse = await getFamilyRecipes(familyId);
  const recipes = recipesResponse?.recipes;

  if (!recipes || recipes.length === 0) {
    return null;
  }

  return <RecipesGrid recipes={recipes} />;
};

export default FamilyRecipesGrid;
