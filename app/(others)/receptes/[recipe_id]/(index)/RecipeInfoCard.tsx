import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { recipeAndAuthor } from "@/types";

interface RecipeInfoCardProps {
  recipe: recipeAndAuthor;
}

const RecipeInfoCard: React.FC<RecipeInfoCardProps> = ({ recipe }) => {
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
      <CardHeader>
        <CardTitle>Preparació</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-outside pl-6 marker:text-orange-600 marker:font-extrabold marker:text-2xl ml-4 ">
          {recipe?.steps.map((step, i) => (
            <li key={i} className="text-lg my-3">
              {step}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default RecipeInfoCard;
