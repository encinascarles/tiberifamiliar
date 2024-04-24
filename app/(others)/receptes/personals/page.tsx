import { getPersonalRecipes } from "@/actions/recipes";
import AddRecipeCard from "@/app/(others)/receptes/personals/AddRecipeCard";
import RecipeCard from "@/components/RecipeCard";

export default async function PersonalRecipesPage() {
  const recipes = await getPersonalRecipes();

  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Receptes Personals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AddRecipeCard />
        {recipes &&
          recipes.map((recipe, i) => (
            <RecipeCard
              key={i}
              title={recipe.title}
              id={recipe.id}
              prep_time={recipe.prep_time}
              total_time={recipe.total_time}
              image={recipe.image}
              personal={true}
            />
          ))}
      </div>
    </div>
  );
}
