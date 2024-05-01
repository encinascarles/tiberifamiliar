import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { recipeAndAuthor } from "@/types";

interface RecipeIngredientsCardProps {
  recipe: recipeAndAuthor;
}

const RecipeIngredientsCard: React.FC<RecipeIngredientsCardProps> = ({
  recipe,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none">
          {recipe?.ingredients.map((ingredient, i) => (
            <li key={i} className="flex items-center gap-2 text-lg my-3">
              <Checkbox className="w-6 h-6" />
              {ingredient}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecipeIngredientsCard;
