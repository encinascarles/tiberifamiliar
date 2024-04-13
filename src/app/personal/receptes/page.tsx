import RecipeCard from "@/components/RecipeCard";
import AddRecipeCard from "@/components/AddRecipeCard";

export default function PersonalRecipesPage() {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Receptes Personals</h1>
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
