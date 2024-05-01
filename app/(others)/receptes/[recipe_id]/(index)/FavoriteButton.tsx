"use client";
import { toggleFavoriteRecipe } from "@/actions/recipes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsFavorite } from "@/stores/useIsFavorite";
import { recipeAndAuthor } from "@/types";
import { BookmarkMinus, BookmarkPlus } from "lucide-react";
import { useLayoutEffect } from "react";

interface FavoriteButtonProps {
  recipe: recipeAndAuthor;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ recipe }) => {
  const { isFavorite, toggle, setIsFavorite } = useIsFavorite();
  const { toast } = useToast();

  useLayoutEffect(() => {
    setIsFavorite(recipe.favorite);
  }, [recipe.favorite]);

  const handleClick = async () => {
    // Add or remove from favorites
    toggle();
    const response = await toggleFavoriteRecipe(recipe.id);
    if ("error" in response) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      toggle();
      return;
    }
  };

  return (
    <Button className="w-full gap-2" onClick={() => handleClick()}>
      {isFavorite ? (
        <>
          <BookmarkMinus size={20} />
          Treure de preferits
        </>
      ) : (
        <>
          <BookmarkPlus size={20} />
          Guardar a preferits
        </>
      )}
    </Button>
  );
};

export default FavoriteButton;
