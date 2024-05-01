import { getRecipe } from "@/actions/recipes";
import RecipeInfoCard from "./RecipeInfoCard";
import RecipeMainCards from "./RecipeMainCards";

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
        <RecipeMainCards recipe={recipe} />
        <RecipeInfoCard recipe={recipe} />
      </div>
    </div>
  );
}
