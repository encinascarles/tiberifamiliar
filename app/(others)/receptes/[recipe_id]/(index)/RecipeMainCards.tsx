import { recipeAndAuthor } from "@/types";
import RecipeImageCard from "./RecipeImageCard";
import RecipeSideInfoCard from "./RecipeSideInfoCard";

interface RecipeMainCardsProps {
  recipe: recipeAndAuthor;
}
const RecipeMainCards: React.FC<RecipeMainCardsProps> = ({ recipe }) => {
  return (
    <div className="flex flex-col justify-between gap-4 mt-4 items-start">
      <RecipeImageCard recipe={recipe} />
      <RecipeSideInfoCard recipe={recipe} />
    </div>
  );
};

export default RecipeMainCards;
