import AddRecipeCard from "@/components/AddRecipeCard";
import { recipeAndAuthor } from "@/types";
import RecipeCard from "./RecipeCard";

type recipesGridProps = {
  recipes: recipeAndAuthor[];
  addRecipe?: boolean;
  personal?: boolean;
};

const RecipesGrid: React.FC<recipesGridProps> = ({
  recipes,
  addRecipe,
  personal = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
      {addRecipe && <AddRecipeCard />}
      {recipes.map((recipe, i) => (
        <RecipeCard
          key={i}
          title={recipe.title}
          id={recipe.id}
          user_name={recipe.author_name}
          user_image={recipe.author_image}
          prep_time={recipe.prep_time}
          total_time={recipe.total_time}
          image={recipe.image}
          personal={personal}
        />
      ))}
    </div>
  );
};

export default RecipesGrid;
