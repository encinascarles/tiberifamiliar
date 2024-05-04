"use server";

import { getFamilyRecipes } from "@/actions/recipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipesGrid from "@/components/recipes/RecipesGrid";

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
  return (
    <RecipesGrid>
      {recipes.map((recipe, i) => (
        <RecipeCard key={i} recipe={recipe} />
      ))}
    </RecipesGrid>
  );
};

export default FamilyRecipesGrid;
