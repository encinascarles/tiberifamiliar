import { getFamiliesRecipes } from "@/actions/recipes";
import ShowRecipesLayout from "@/components/recipes/ShowRecipesLayout";

export default async function FamiliesRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ShowRecipesLayout
      pageParams={searchParams.page}
      getRecipes={getFamiliesRecipes}
      title="Receptes Generades pel TiberIA"
    />
  );
}
