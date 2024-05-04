import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { recipeAndAuthor } from "@/types";
import { Bookmark, ChefHat, CookingPot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const RecipeCard = async ({
  recipe,
  personal = false,
  draft = false,
}: {
  recipe: recipeAndAuthor;
  personal?: boolean;
  draft?: boolean;
}) => {
  return (
    <Card className="flex flex-col justify-between h-full">
      <Link
        href={`/receptes/${recipe.id}${draft ? "/edita" : ""}`}
        className="cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={recipe.image ? recipe.image : "/default_recipe.png"}
            alt="Recipe Image"
            fill
            className="rounded-t-lg aspect-square object-cover"
          />
          {recipe.favorite && (
            <Bookmark
              size={90}
              className="absolute -top-5 right-4 z-20 text-orange-500"
              fill="currentColor"
            />
          )}
        </div>
        <CardHeader className="pb-5">
          <CardTitle className="flex items-center justify-between gap-2">
            <span className="line-clamp-3 w-ful pb-1">{recipe.title}</span>
            {!personal && (
              <Avatar className="cursor-pointer h-12 w-12">
                <AvatarImage
                  src={
                    recipe.author_image
                      ? recipe.author_image
                      : "/default_user.jpg"
                  }
                />
              </Avatar>
            )}
          </CardTitle>
        </CardHeader>
      </Link>
      <CardContent>
        <div
          className={cn(
            "flex items-center w-full",
            personal ? "justify-start" : "justify-between"
          )}
        >
          {!personal && (
            <span className="hover:text-orange-500 truncate">
              <Link href="perfil/_userid_n" className="w-full" passHref>
                {recipe.author_name}
              </Link>
            </span>
          )}
          <div className="flex gap-2 flex-shrink-0">
            {recipe.prep_time && (
              <div className="flex items-center">
                <ChefHat className="h-7 text-orange-500" />
                <p className="font-bold tracking-tighter">
                  {recipe.prep_time + "'"}
                </p>
              </div>
            )}
            <div className="flex items-center">
              <CookingPot className="h-6 text-orange-500" />
              <p className="font-bold tracking-tighter">
                {recipe.total_time}
                <span className="font-extrabold">{"'"}</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default RecipeCard;
