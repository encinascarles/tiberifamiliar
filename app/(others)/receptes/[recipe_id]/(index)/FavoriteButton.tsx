"use client";
import { isFavoriteRecipe, toggleFavoriteRecipe } from "@/actions/recipes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FavoriteButtonProps {
  recipeId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ recipeId }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchIsFavorite = async () => {
    setIsLoading(true);
    const response = await isFavoriteRecipe(recipeId);
    if ("error" in response) return;
    setIsFavorite(response.favorite);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIsFavorite();
  }, []);

  const handleClick = async () => {
    // Add or remove from favorites
    setIsFavorite(!isFavorite);
    const response = await toggleFavoriteRecipe(recipeId);
    if ("error" in response) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      setIsFavorite(!isFavorite);
      return;
    }
  };

  return (
    <Button size="icon" variant="ghost" onClick={() => handleClick()}>
      {isLoading ? (
        <Heart size="40" fill="#808080" strokeWidth={0} />
      ) : isFavorite ? (
        <Heart fill={"#f97316"} strokeWidth={0} size="40" />
      ) : (
        <Heart size="40" />
      )}
    </Button>
  );
};

export default FavoriteButton;
