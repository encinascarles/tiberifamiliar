"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { recipeAndAuthor } from "@/types";
import { useState } from "react";

interface RecipeIngredientsCardProps {
  recipe: recipeAndAuthor;
}

const RecipeIngredientsCard: React.FC<RecipeIngredientsCardProps> = ({
  recipe,
}) => {
  const [checkedItems, setCheckedItems] = useState(
    new Array(recipe.ingredients.length).fill(false)
  );

  const handleCheckChange = (index: number) => {
    console.log(index);
    setCheckedItems((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none">
          {recipe?.ingredients.map((ingredient, i) => (
            <li key={i} className="flex items-center gap-2 text-lg my-3">
              <Checkbox
                checked={checkedItems[i]}
                onCheckedChange={() => handleCheckChange(i)}
                className="w-6 h-6"
              />
              <span
                className={
                  checkedItems[i]
                    ? "line-through decoration-orange-600 decoration-2"
                    : ""
                }
              >
                {ingredient}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecipeIngredientsCard;
