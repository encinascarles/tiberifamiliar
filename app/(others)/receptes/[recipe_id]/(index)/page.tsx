import { getRecipe } from "@/actions/recipes/getRecipe";
import RecipeImageCard from "./RecipeImageCard";
import RecipeIngredientsCard from "./RecipeIngredientsCard";
import RecipeOriginCard from "./RecipeOriginCard";
import RecipeRecommendationsCard from "./RecipeRecommendationsCard";
import RecipeSideInfoCard from "./RecipeSideInfoCard";
import RecipeStepsCard from "./RecipeStepsCard";

export default async function ShowRecipePage({
  params,
}: {
  params: { recipe_id: string };
}) {
  const recipe = await getRecipe(params.recipe_id);
  if ("error" in recipe) return;

  return (
    <div className="container mt-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-4 mt-4 ">
          <RecipeImageCard recipe={recipe} />
          <RecipeSideInfoCard recipe={recipe} />
        </div>
        {recipe.origin && <RecipeOriginCard recipe={recipe} />}
        <RecipeIngredientsCard recipe={recipe} />
        {recipe.recommendations && (
          <RecipeRecommendationsCard recipe={recipe} />
        )}
        <RecipeStepsCard recipe={recipe} />
      </div>
    </div>
  );
}
