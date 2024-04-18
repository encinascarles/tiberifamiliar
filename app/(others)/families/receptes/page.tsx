import AddRecipeCard from "../../../../components/AddRecipeCard";
import RecipeCard from "../../../../components/RecipeCard";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../../components/ui/avatar";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

export default function FamiliesRecipesPage() {
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">Receptes Familiars</h1>
        {Array.from({ length: 6 }).map((_, i) => (
          <Link key={i} href="/families/_family_id_">
            <Avatar className="cursor-pointer h-14 w-14">
              <AvatarImage src="https://github.com/shadcn.png" />
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
        {Array.from({ length: 10 }).map((_, i) => (
          <RecipeCard key={i} />
        ))}
      </div>
    </div>
  );
}