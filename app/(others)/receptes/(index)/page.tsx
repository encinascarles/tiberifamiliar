import RecipesCarousel from "./RecipesCarousel";
import { getPublicRecipes } from "@/actions/recipes/getPublicRecipes";
import { getPersonalRecipes } from "@/actions/recipes/getPersonalRecipes";
import { getFamiliesRecipes } from "@/actions/recipes/getFamiliesRecipes";
import { getDraftRecipes } from "@/actions/recipes/getDraftRecipes";
import DraftCarousel from "./DraftCarousel";
import AddRecipeCard from "@/components/recipes/AddRecipeCard";
import { getAIRecipes } from "@/actions/recipes/getAiRecipes";

export default async function HomePage() {
  // Fetch all recipes
  const [
    personalRecipes,
    familiesRecipes,
    publicRecipes,
    draftRecipes,
    aiRecipes,
  ] = await Promise.all([
    getPersonalRecipes(1, 20),
    getFamiliesRecipes(1, 20),
    getPublicRecipes(1, 20),
    getDraftRecipes(),
    getAIRecipes(1, 20),
  ]);

  // Check if there was an error fetching the recipes
  if (
    "error" in personalRecipes ||
    "error" in familiesRecipes ||
    "error" in publicRecipes ||
    "error" in draftRecipes ||
    "error" in aiRecipes
  )
    throw new Error("Error carregant les receptes");

  return (
    <div className="md:container flex flex-col gap-10">
      <RecipesCarousel
        recipes={familiesRecipes.recipes}
        title="Descobreix receptes dels teus familiars"
      />
      <RecipesCarousel
        recipes={publicRecipes.recipes}
        title="Descobreix receptes d'altres usuaris de Tiberi"
      />
      <RecipesCarousel
        recipes={personalRecipes.recipes}
        title="Les teves receptes"
        personal
      />
      <DraftCarousel recipes={draftRecipes} title="Continua on ho has deixat" />
      <div>
        <h1 className="ml-8 2xl:ml-0 text-4xl font-bold my-10 mr-10">
          {personalRecipes.recipes.length === 0 && draftRecipes.length === 0
            ? "Crea la teva primera recepta"
            : "Contribueix amb una nova recepta"}
        </h1>
        <AddRecipeCard />
      </div>
      <RecipesCarousel
        recipes={aiRecipes.recipes}
        title="Explora el receptari de Tiberis fets per IA"
      />
    </div>
  );
}
