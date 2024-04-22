import { getFamiliesRecipes } from "@/actions/recipes";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import RecipeCard from "../../../../components/RecipeCard";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";

export default async function FamiliesRecipesPage() {
  const recipes = await getFamiliesRecipes();
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">Receptes Familiars</h1>
        {Array.from({ length: 6 }).map((_, i) => (
          <Link key={i} href="/families/_family_id_">
            <Avatar className="cursor-pointer h-14 w-14">
              <AvatarImage src="/default_user.jpg" />
            </Avatar>
          </Link>
        ))}
        <Link href="/families">
          <Avatar className="cursor-pointer h-14 w-14">
            <AvatarFallback>
              <Ellipsis />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {recipes &&
          recipes.map((recipe, i) => (
            <RecipeCard
              key={i}
              title={recipe.title}
              id={recipe.id}
              username={recipe.author.username as string}
              user_image={recipe.author.image as string}
              prep_time={recipe.prep_time}
              total_time={recipe.total_time}
              image={recipe.image}
              personal={false}
            />
          ))}
      </div>
    </div>
  );
}
