import { Card, CardFooter } from "@/components/ui/card";
import { recipeAndAuthor } from "@/types";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeSideInfoCardProps {
  recipe: recipeAndAuthor;
  isOverflowing: boolean;
}

const RecipeImageCard: React.FC<RecipeSideInfoCardProps> = ({
  recipe,
  isOverflowing,
}) => {
  return (
    <Card className={`w-full ${!isOverflowing && "lg:w-8/12"}`}>
      <div className="aspect-[4/3] relative">
        <Image
          src={recipe.image ? recipe.image : "/demo_images/recipe_image.jpg"}
          fill
          alt="family image"
          objectFit="cover"
          className="rounded-t-lg z-10"
        />
        <Skeleton className="h-full w-full rounded-b-none rounded-t-lg z-0" />
      </div>
      <CardFooter className="pt-4 flex justify-between">
        <h1 className="text-3xl font-semibold">{recipe.title}</h1>
        <FavoriteButton recipeId={recipe.id} />
      </CardFooter>
    </Card>
  );
};

export default RecipeImageCard;
