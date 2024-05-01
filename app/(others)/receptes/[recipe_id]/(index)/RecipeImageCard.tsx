"use client";
import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsFavorite } from "@/stores/useIsFavorite";
import { recipeAndAuthor } from "@/types";
import { Bookmark } from "lucide-react";
import Image from "next/image";

interface RecipeSideInfoCardProps {
  recipe: recipeAndAuthor;
}

const RecipeImageCard: React.FC<RecipeSideInfoCardProps> = ({ recipe }) => {
  const { isFavorite } = useIsFavorite();
  return (
    <Card className="w-full lg:w-8/12">
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={recipe.image ? recipe.image : "/demo_images/recipe_image.jpg"}
          fill
          alt="family image"
          objectFit="cover"
          className="rounded-t-lg z-10"
        />
        {isFavorite && (
          <Bookmark
            size={90}
            className="absolute -top-5 right-4 z-20 text-orange-500"
            fill="currentColor"
          />
        )}
        <Skeleton className="h-full w-full rounded-b-none rounded-t-lg z-0" />
      </div>
      <CardFooter className="pt-4">
        <h1 className="text-3xl font-semibold">{recipe.title}</h1>
      </CardFooter>
    </Card>
  );
};

export default RecipeImageCard;
