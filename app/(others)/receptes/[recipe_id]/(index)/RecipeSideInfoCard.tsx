"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { recipeAndAuthor } from "@/types";
import { useLayoutEffect, useRef } from "react";

interface RecipeSideInfoCardProps {
  recipe: recipeAndAuthor;
  isOverflowing: boolean;
  setIsOverflowing: (isOverflowing: boolean) => void;
}

const RecipeSideInfoCard: React.FC<RecipeSideInfoCardProps> = ({
  recipe,
  isOverflowing,
  setIsOverflowing,
}) => {
  // Create a reference to the recommendations and origin elements
  const recommendationsRef = useRef<HTMLHeadingElement | null>(null);
  const originRef = useRef<HTMLHeadingElement | null>(null);

  // Check if the recommendations or origin elements are overflowing at mount (when finished rendering)
  useLayoutEffect(() => {
    const recommendationsElement = recommendationsRef.current;
    const originElement = originRef.current;
    if (
      recommendationsElement &&
      recommendationsElement.scrollHeight > recommendationsElement.clientHeight
    ) {
      setIsOverflowing(true);
    }
    if (
      originElement &&
      originElement.scrollHeight > originElement.clientHeight
    ) {
      setIsOverflowing(true);
    }
  }, [recipe, setIsOverflowing]);

  return (
    <Card className={`w-full ${!isOverflowing && "lg:w-4/12"}`}>
      <div className="p-4 flex flex-col gap-4">
        <p className="text-lg">
          <b>Temps de Preparació:</b> {recipe.prep_time}min
        </p>
        <p className="text-lg">
          <b>Temps de Total:</b> {recipe.total_time}min
        </p>
        {recipe.recommendations && (
          <p
            ref={recommendationsRef}
            className={`text-lg ${
              !isOverflowing && "lg:line-clamp-[8]"
            } text-justify`}
          >
            <b>Recomanacions:</b>{" "}
            {recipe?.recommendations.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        )}
        {recipe.origin && (
          <p
            ref={originRef}
            className={`text-lg ${
              !isOverflowing && "lg:line-clamp-[8]"
            } text-justify`}
          >
            <b>Procedència:</b>{" "}
            {recipe?.origin.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        )}
        <div className="flex gap-4 items-center w-full justify-center border-t-2 pt-4">
          <Avatar className="cursor-pointer h-12 w-12">
            <AvatarImage
              src={
                recipe.author_image ? recipe.author_image : "/default_user.jpg"
              }
            />
          </Avatar>
          <h1 className="font-semibold line-clamp-2 overflow-hidden">
            Feta per{" "}
            <span className="font-bold text-orange-600">
              {recipe.author_name}
            </span>
          </h1>
        </div>
      </div>
    </Card>
  );
};

export default RecipeSideInfoCard;
