import { getPersonalRecipes } from "@/actions/recipes";
import PersonalRecipesGrid from "./PersonalRecipesGrid";

export default async function PersonalRecipesPage() {
  const recipes = await getPersonalRecipes();

  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Receptes Personals</h1>
      <PersonalRecipesGrid />
    </div>
  );
}
