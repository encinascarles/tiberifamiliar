import AddRecipeCard from "@/components/AddRecipeCard";
import { recipeAndAuthor } from "@/types";
import RecipeCard from "./RecipeCard";

type recipesGridProps = {
  recipes: recipeAndAuthor[];
  addRecipe?: boolean;
  personal?: boolean;
  draft?: boolean;
};

const RecipesGrid: React.FC<recipesGridProps> = ({
  recipes,
  addRecipe,
  personal = false,
  draft = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
      {addRecipe && <AddRecipeCard />}
      {recipes.map((recipe, i) => (
        <RecipeCard key={i} recipe={recipe} personal={personal} draft={draft} />
      ))}
    </div>
  );
};

export default RecipesGrid;
