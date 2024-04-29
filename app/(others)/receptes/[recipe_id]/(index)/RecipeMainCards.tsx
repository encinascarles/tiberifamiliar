"use client";
import { recipeAndAuthor } from "@/types";
import { useState } from "react";
import RecipeImageCard from "./RecipeImageCard";
import RecipeSideInfoCard from "./RecipeSideInfoCard";

interface RecipeMainCardsProps {
  recipe: recipeAndAuthor;
}
const RecipeMainCards: React.FC<RecipeMainCardsProps> = ({ recipe }) => {
  // State to check if the RecipeRecommendations or Origin is overflowing
  const [isOverflowing, setIsOverflowing] = useState(false);

  return (
    <div
      className={`flex flex-col ${
        !isOverflowing && "lg:flex-row"
      } justify-between gap-4 mt-4 items-start`}
    >
      <RecipeImageCard recipe={recipe} isOverflowing={isOverflowing} />
      <RecipeSideInfoCard
        recipe={recipe}
        isOverflowing={isOverflowing}
        setIsOverflowing={setIsOverflowing}
      />
    </div>
  );
};

export default RecipeMainCards;
