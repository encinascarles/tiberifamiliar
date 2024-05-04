import { getPublicRecipes } from "@/actions/recipes";
import ShowRecipesLayout from "@/components/recipes/ShowRecipesLayout";

export default async function PublicRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ShowRecipesLayout
      pageParams={searchParams.page}
      getRecipes={getPublicRecipes}
      title="Receptes Publiques"
    />
  );
}
