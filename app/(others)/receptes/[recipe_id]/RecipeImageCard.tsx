import { Card, CardFooter } from "@/components/ui/card";
import { recipeAndAuthor } from "@/types";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";

interface RecipeSideInfoCardProps {
  recipe: recipeAndAuthor;
}

const RecipeImageCard: React.FC<RecipeSideInfoCardProps> = ({ recipe }) => {
  return (
    <Card className="w-full lg:w-8/12">
      <div className="aspect-[4/3] relative">
        <Image
          src={recipe.image ? recipe.image : "/demo_images/recipe_image.jpg"}
          fill
          alt="family image"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <CardFooter className="pt-4 flex justify-between">
        <h1 className="text-3xl font-semibold">{recipe.title}</h1>
        <FavoriteButton recipeId={recipe.id} />
      </CardFooter>
    </Card>
  );
};

export default RecipeImageCard;
