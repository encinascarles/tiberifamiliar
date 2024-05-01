import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recipeAndAuthor } from "@/types";

interface RecipeRecommendationsCardProps {
  recipe: recipeAndAuthor;
}

const RecipeRecommendationsCard: React.FC<RecipeRecommendationsCardProps> = ({
  recipe,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recomanacions de l'autor</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          {recipe?.recommendations?.split("\n").map((line, i) => (
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

export default RecipeRecommendationsCard;
