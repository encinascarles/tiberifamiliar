import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { CookingPot, Utensils, ChefHat } from "lucide-react";
import { cn } from "../lib/utils";

const RecipeCard = ({ personal = false }: { personal?: boolean }) => (
  <Card className="w-[400] h-[400]">
    <Link href="/receptes/_recipeid_n" className="cursor-pointer">
      <div className="relative aspect-square">
        <Image
          src="/demo_images/recipe_image.jpg"
          alt="Recipe Image"
          fill
          className="rounded-t-lg aspect-square object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Patates amb tomàquet
          {!personal && (
            <Avatar className="cursor-pointer h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" />
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
            <span className="hover:text-orange-500">@carlesencinas</span>
          </Link>
        )}
        <div className="flex gap-2">
          <div className="flex items-center">
            <ChefHat className="h-5" />
            <p>30 min</p>
          </div>
          <div className="flex items-center">
            <CookingPot className="h-5" />
            <p>50 min</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default RecipeCard;
