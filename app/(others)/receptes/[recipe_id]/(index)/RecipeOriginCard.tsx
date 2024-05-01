import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recipeAndAuthor } from "@/types";

interface RecipeOriginCardProps {
  recipe: recipeAndAuthor;
}

const RecipeOriginCard: React.FC<RecipeOriginCardProps> = ({ recipe }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Origen de la recepta</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          {recipe?.origin?.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </CardContent>
    </Card>
  );
};

export default RecipeOriginCard;
