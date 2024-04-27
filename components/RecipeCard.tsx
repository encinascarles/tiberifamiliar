import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ChefHat, CookingPot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const RecipeCard = async ({
  title,
  id,
  user_name,
  user_image,
  prep_time,
  total_time,
  image,
  personal = false,
  draft = false,
}: {
  title: string;
  id: string;
  user_name: string | null;
  user_image?: string | null;
  prep_time: number;
  total_time: number;
  image: string | null;
  personal?: boolean;
  draft?: boolean;
}) => {
  const user = await currentUser();
  console.log(image);
  return (
    <Card className="w-[400] h-[400]">
      <Link
        href={`/receptes/${id}${draft ? "/edita" : ""}`}
        className="cursor-pointer"
      >
        <div className="relative aspect-square">
          <Image
            src={image ? image : "/demo_images/recipe_image.jpg"}
            alt="Recipe Image"
            fill
            className="rounded-t-lg aspect-square object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            {!personal && (
              <Avatar className="cursor-pointer h-12 w-12">
                <AvatarImage
                  src={user_image ? user_image : "/default_user.jpg"}
                />
              </Avatar>
            )}
          </CardTitle>
        </CardHeader>
      </Link>
      <CardContent>
        <div
          className={cn(
            "flex items-center",
            personal ? "justify-start" : "justify-between"
          )}
        >
          {!personal && (
            <Link href="perfil/_userid_n" passHref>
              <span className="hover:text-orange-500">{user_name}</span>
            </Link>
          )}
          <div className="flex gap-2">
            <div className="flex items-center">
              <ChefHat className="h-5" />
              <p>{prep_time} min</p>
            </div>
            <div className="flex items-center">
              <CookingPot className="h-5" />
              <p>{total_time} min</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default RecipeCard;
