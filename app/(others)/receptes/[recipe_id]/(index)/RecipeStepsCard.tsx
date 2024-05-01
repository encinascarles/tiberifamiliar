import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recipeAndAuthor } from "@/types";

interface RecipeStepsCardProps {
  recipe: recipeAndAuthor;
}

const RecipeStepsCard: React.FC<RecipeStepsCardProps> = ({ recipe }) => {
  return (
    <Card>
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

export default RecipeStepsCard;
