import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { recipeAndAuthor } from "@/types";
import Image from "next/image";
import Link from "next/link";

const DraftCard = async ({ recipe }: { recipe: recipeAndAuthor }) => {
  return (
    <Link href={`/receptes/${recipe.id}/edita`}>
      <Card className="w-full flex h-[180px] ">
        <div className="relative h-full w-[150px] xs:w-[180px] sm:w-[230px] flex-shrink-0 transition-all duration-300">
          <Image
            src={recipe.image ? recipe.image : "/default_recipe.png"}
            alt={`recipe image`}
            sizes="(max-width: 500px) 150px, (max-width: 640px) 180px, 230px"
            quality={50}
            fill
            objectFit="cover"
            className="rounded-l-lg z-10 grayscale"
          />
          <Skeleton className="h-full w-full rounded-r-none rounded-l-lg z-0" />
        </div>
        <div className="flex flex-col p-4 gap-4 line-clamp-3">
          <CardTitle className="text-lg  w-full h-fit">
            {recipe.title ? recipe.title : "Sense títol"}
          </CardTitle>
          Modificada: {recipe.updated_at?.toLocaleDateString("es-ES")}
        </div>
      </Card>
    </Link>
  );
};

export default DraftCard;
