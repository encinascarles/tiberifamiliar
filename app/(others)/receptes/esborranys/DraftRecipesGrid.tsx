"use server";

import { getDraftRecipes } from "@/actions/recipes";
import { recipeAndAuthor } from "@/types";
import DraftCard from "./DraftCard";

const DraftRecipesGrid = async () => {
  const recipes = await getDraftRecipes();
  if ("error" in recipes) return null;

  if (recipes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
      {recipes.map((recipe: recipeAndAuthor) => (
        <DraftCard recipe={recipe} />
      ))}
    </div>
  );
};

export default DraftRecipesGrid;
