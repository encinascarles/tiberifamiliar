import { getPublicRecipes } from "@/actions/recipes";
import { currentFullUser } from "@/lib/auth";
import RecipeCard from "../../../components/RecipeCard";

export default async function PublicRecipesPage() {
  const user = await currentFullUser();
  const recipes = await getPublicRecipes();
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">Receptes Publiques</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {recipes.map((recipe, i) => (
          <RecipeCard
            key={i}
            title={recipe.title}
            username={recipe.author.username as string}
            user_image={recipe.author.image as string}
            prep_time={recipe.prep_time}
            total_time={recipe.total_time}
            image={recipe.image}
            // personal={user?.username === recipe.author.username}
          />
        ))}
      </div>
    </div>
  );
}
