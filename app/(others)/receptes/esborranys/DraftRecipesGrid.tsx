"use server";
import { recipeAndAuthor } from "@/types";
import DraftCard from "@/components/recipes/DraftCard";
import DraftGridLayout from "./DraftGridLayout";
import { getDraftRecipes } from "@/actions/recipes/getDraftRecipes";

const DraftRecipesGrid = async () => {
  const recipes = await getDraftRecipes();
  if ("error" in recipes) return null;

  if (recipes.length === 0) return null;

  return (
    <DraftGridLayout>
      {recipes.map((recipe: recipeAndAuthor, key) => (
        <DraftCard recipe={recipe} key={key} />
      ))}
    </DraftGridLayout>
  );
};

export default DraftRecipesGrid;
