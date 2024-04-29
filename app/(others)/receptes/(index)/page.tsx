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
        recipes={personalRecipes}
        title="Receptes Personals"
        personal
      />
      <RecipesCarousel recipes={familiesRecipes} title="Receptes Familiars" />
      <RecipesCarousel recipes={publicRecipes} title="Receptes Publiques" />
    </div>
  );
}
