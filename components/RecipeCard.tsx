import { currentUser } from "@/lib/auth";
import { ChefHat, CookingPot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "../lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const RecipeCard = async ({
  title,
  username,
  user_image,
  prep_time,
  total_time,
  image,
  personal = false,
}: {
  title: string;
  username: string;
  user_image: string;
  prep_time: number;
  total_time: number;
  image: string | null;
  personal?: boolean;
}) => {
  const user = await currentUser();
  console.log(image);
  return (
    <Card className="w-[400] h-[400]">
      <Link href="/receptes/_recipeid_n" className="cursor-pointer">
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
                  src={
                    user_image ? user_image : "https://github.com/shadcn.png"
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
            "flex items-center",
            personal ? "justify-start" : "justify-between"
          )}
        >
          {!personal && (
            <Link href="perfil/_userid_n" passHref>
              <span className="hover:text-orange-500">@{username}</span>
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
