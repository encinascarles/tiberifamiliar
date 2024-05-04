import { getFavoriteRecipes } from "@/actions/recipes";
import ShowRecipesLayout from "@/components/recipes/ShowRecipesLayout";

export default async function FavoriteRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ShowRecipesLayout
      pageParams={searchParams.page}
      getRecipes={getFavoriteRecipes}
      title="Receptes Preferides"
    />
  );
}
