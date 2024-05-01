"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { recipeAndAuthor } from "@/types";
import { Minus, Plus } from "lucide-react";
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
  const [servings, setServings] = useState(recipe.servings.toString());

  const increment = () => setServings((Number(servings) + 1).toString());
  const decrement = () =>
    setServings((Number(servings) > 1 ? Number(servings) - 1 : 1).toString());

  const handleCheckChange = (index: number) => {
    console.log(index);
    setCheckedItems((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value === "" ||
      (!isNaN(Number(e.target.value)) && Number(e.target.value) > 0)
    ) {
      setServings(e.target.value);
      return;
    }
  };

  const handleBlur = () => {
    if (isNaN(Number(servings)) || Number(servings) < 1) {
      setServings(recipe.servings.toString());
    }
  };

  const parsedIngredients = (ingredient: string) => {
    if (Number(servings) === recipe.servings) return ingredient;
    const words = ingredient
      .split(/(\d+[\.,]?\d*)/)
      .filter(Boolean)
      .map((word) => {
        if (!isNaN(Number(word.replace(",", ".")))) {
          const result =
            (Number(word.replace(",", ".")) * Number(servings)) /
            recipe.servings;
          const formattedResult = Number.isInteger(result)
            ? result.toString()
            : result.toFixed(1).replace(".", ",");
          return (
            <span className="text-orange-500 font-semibold">
              {formattedResult}
            </span>
          );
        } else {
          return word;
        }
      });

    return <>{words}</>;
  };
  return (
    <Card className="relative">
      {/* Counter for settings desired servings */}
      <Card className="absolute top-0 right-0 flex items-center flex-col bg-neutral-100 border-t-0 border-r-0 rounded-br-none rounded-tl-none">
        <span className="text-lg font-semibold tracking-tigh">Porcions</span>
        <div className="flex items-center">
          <Button
            className="rounded-none rounded-bl-lg h-8 w-7 p-0"
            onClick={decrement}
          >
            <Minus size={20} strokeWidth={3} />
          </Button>
          <Input
            type="text"
            value={servings}
            className={
              "mx-2 w-8 text-center p-0 h-8 rounded-none m-0 text-lg md:text-lg font-semibold" +
              (Number(servings) !== recipe.servings ? " text-orange-500" : "")
            }
            onChange={handleServingsChange}
            onBlur={handleBlur}
          />
          <Button className="rounded-none  h-8 w-7 p-0" onClick={increment}>
            <Plus size={20} strokeWidth={3} />
          </Button>
        </div>
      </Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
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
                    ? "line-through decoration-orange-500 decoration-2"
                    : ""
                }
              >
                {parsedIngredients(ingredient)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecipeIngredientsCard;
