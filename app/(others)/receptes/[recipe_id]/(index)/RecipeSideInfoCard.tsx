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
import { useCurrentUser } from "@/hooks/use-current-user";
import { recipeAndAuthor } from "@/types";
import { Pencil, Printer } from "lucide-react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import FavoriteButton from "./FavoriteButton";
import ShareButton from "./ShareButton";

interface RecipeSideInfoCardProps {
  recipe: recipeAndAuthor;
}

const RecipeSideInfoCard: React.FC<RecipeSideInfoCardProps> = ({ recipe }) => {
  const user = useCurrentUser();
  return (
    <Card className="w-full lg:w-4/12 flex flex-col gap-4 justify-stretch">
      <CardHeader>
        <CardTitle>Informació bàsica</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pb-2">
        <div className="space-y-4">
          {recipe.prep_time && (
            <p className="text-lg">
              <b className="font-semibold">Temps de Preparació:</b>{" "}
              {recipe.prep_time}min
            </p>
          )}
          <p className="text-lg">
            <b className="font-semibold">Temps Total:</b> {recipe.total_time}min
          </p>
          {recipe.author_id === user?.id && (
            <div className="flex items-center justify-stretch gap-4 pt-2 pb-6">
              <Button className="gap-2 flex-grow" asChild>
                <Link href={`/receptes/${recipe.id}/edita`}>
                  <Pencil size={20} />
                  Editar
                </Link>
              </Button>
              <DeleteButton recipe_id={recipe.id} className="flex-grow" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          {/* <div className="w-full border-b-2"></div> */}
          <p className="text-lg  text-neutral-500 font-light">
            <b className="font-medium">Creada:</b>{" "}
            {recipe.created_at?.toLocaleDateString("es-ES")}
          </p>
          <p className="text-lg  text-neutral-500 font-light">
            <b className="font-medium">Modificada:</b>{" "}
            {recipe.updated_at?.toLocaleDateString("es-ES")}
          </p>
          <div className="pt-4 space-y-4">
            <FavoriteButton recipe={recipe} />
            <div className="flex items-center justify-stretch gap-4 ">
              <ShareButton />
              <Button
                variant="secondary"
                className="gap-2 flex-grow"
                onClick={() => window.print()}
              >
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
