import { recipeAndAuthor } from "@/types";
import RecipeImageCard from "./RecipeImageCard";
import RecipeSideInfoCard from "./RecipeSideInfoCard";

interface RecipeMainCardsProps {
  recipe: recipeAndAuthor;
}
const RecipeMainCards: React.FC<RecipeMainCardsProps> = ({ recipe }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-4 mt-4 ">
      <RecipeImageCard recipe={recipe} />
      <RecipeSideInfoCard recipe={recipe} />
    </div>
  );
};

export default RecipeMainCards;
