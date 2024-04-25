import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { recipeAndAuthor } from "@/types";

interface RecipeSideInfoCardProps {
  recipe: recipeAndAuthor;
}

const RecipeSideInfoCard: React.FC<RecipeSideInfoCardProps> = ({ recipe }) => {
  return (
    <Card className="w-full lg:w-4/12">
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-lg">
          <b>Temps de Preparació:</b> {recipe.prep_time}min
        </h1>
        <h1 className="text-lg">
          <b>Temps de Total:</b> {recipe.total_time}min
        </h1>
        {recipe.recommendations && (
          <h1 className="text-lg md:hidden lg:block">
            <b>Recomanacions:</b> {recipe?.recommendations}
          </h1>
        )}
        {recipe.origin && (
          <h1 className="text-lg md:hidden lg:block">
            <b>Procedència:</b> {recipe?.origin}
          </h1>
        )}

        <div className="flex gap-4 items-center w-full justify-center border-t-2 pt-4">
          <Avatar className="cursor-pointer h-12 w-12">
            <AvatarImage
              src={
                recipe.author_image ? recipe.author_image : "/default_user.jpg"
              }
            />
          </Avatar>
          <h1 className="font-bold">Feta per {recipe.author_name}</h1>
        </div>
      </div>
    </Card>
  );
};

export default RecipeSideInfoCard;
