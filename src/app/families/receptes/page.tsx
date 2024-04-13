import AddRecipeCard from "@/components/AddRecipeCard";
import RecipeCard from "@/components/RecipeCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Ellipsis } from "lucide-react";

export default function FamiliesRecipesPage() {
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">Receptes Familiars</h1>
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarFallback>
            <Ellipsis />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AddRecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>
    </div>
  );
}
