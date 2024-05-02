import {
  getFamiliesRecipes,
  getPersonalRecipes,
  getPublicRecipes,
} from "@/actions/recipes";
import RecipesCarousel from "./RecipesCarousel";

export default async function HomePage() {
  // Fetch all recipes
  const [personalRecipes, familiesRecipes, publicRecipes] = await Promise.all([
    getPersonalRecipes(),
    getFamiliesRecipes(),
    getPublicRecipes(),
  ]);

  // Check if there was an error fetching the recipes
  if (
    "error" in personalRecipes ||
    "error" in familiesRecipes ||
    "error" in publicRecipes
  )
    throw new Error("Error carregant les receptes");

  return (
    <div className="md:container">
      <RecipesCarousel
        recipes={familiesRecipes}
        title="Descobreix receptes dels teus familiars"
      />
      <RecipesCarousel
        recipes={publicRecipes}
        title="Descobreix receptes d'altres usuaris de Tiberi"
      />
      <RecipesCarousel
        recipes={personalRecipes}
        title="Les teves receptes"
        personal
      />
      <h1 className="ml-8 2xl:ml-0 text-4xl font-bold my-10 mr-10">
        Continua on ho has deixat
      </h1>
      <div></div>
      <h1 className="ml-8 2xl:ml-0 text-4xl font-bold my-10 mr-10">
        Contribueix amb una nova recepta
      </h1>
    </div>
  );
}
