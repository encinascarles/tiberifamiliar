import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CookingPot, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

const RecipeCard = ({ personal = false }: { personal?: boolean }) => (
  <Link href="/receptes/_recipeid_n">
    <Card className="cursor-pointer">
      <Image
        src="/demo_images/recipe_image.jpg"
        alt="Recipe Image"
        width="800"
        height="800"
        className="rounded-t-lg"
      />
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
      <CardContent>
        <div
          className={cn(
            "flex items-center",
            personal ? "justify-start" : "justify-between"
          )}
        >
          {!personal && (
            <Link href="perfil/_userid_n" className="hover:text-orange-500">
              @carlesencinas
            </Link>
          )}
          <div className="flex gap-2">
            <div className="flex items-center">
              <Utensils className="h-5" />
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
  </Link>
);

export default RecipeCard;
