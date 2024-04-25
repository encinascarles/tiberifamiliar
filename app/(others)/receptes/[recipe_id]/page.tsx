import { getRecipe } from "@/actions/recipes";
import RecipeImageCard from "./RecipeImageCard";
import RecipeInfoCard from "./RecipeInfoCard";
import RecipeSideInfoCard from "./RecipeSideInfoCard";

export default async function ShowRecipePage({
  params,
}: {
  params: { recipe_id: string };
}) {
  const recipe = await getRecipe(params.recipe_id);
  if ("error" in recipe) return;

  return (
    <div className="container">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4 items-start">
          <RecipeImageCard recipe={recipe} />
          <RecipeSideInfoCard recipe={recipe} />
        </div>
        <RecipeInfoCard recipe={recipe} />
      </div>
    </div>
  );
}
