"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { recipeAndAuthor } from "@/types";
import { BookmarkPlus, Heart, Printer, Share2 } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

interface RecipeSideInfoCardProps {
  recipe: recipeAndAuthor;
}

const RecipeSideInfoCard: React.FC<RecipeSideInfoCardProps> = ({ recipe }) => {
  return (
    <Card className="w-full lg:w-4/12 flex flex-col gap-4 justify-stretch">
      <CardHeader>
        <CardTitle>Informació bàsica</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pb-2">
        <div className="space-y-4">
          <p className="text-lg">
            <b className="font-semibold">Temps de Preparació:</b>{" "}
            {recipe.prep_time}min
          </p>
          <p className="text-lg">
            <b className="font-semibold">Temps Total:</b> {recipe.total_time}min
          </p>
        </div>
        <div className="space-y-2">
          {/* <div className="w-full border-b-2"></div> */}
          <p className="text-lg  text-neutral-500 font-light">
            <b className="font-medium">Creada:</b> 16/09/2021
          </p>
          <p className="text-lg  text-neutral-500 font-light">
            <b className="font-medium">Modificada:</b> 16/09/2021
          </p>
          <div className="pt-4 space-y-4">
            <Button className="w-full gap-2">
              <BookmarkPlus size={20} />
              Guardar a preferides
            </Button>
            <div className="flex items-center justify-stretch gap-4 ">
              <Button variant="secondary" className="gap-2 flex-grow">
                <Share2 size={20} />
                Compartir
              </Button>
              <Button variant="secondary" className="gap-2 flex-grow">
                <Printer size={20} />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 items-center w-full justify-center border-t-2 pt-3 pb-4">
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
      </CardFooter>
    </Card>
  );
};

export default RecipeSideInfoCard;
