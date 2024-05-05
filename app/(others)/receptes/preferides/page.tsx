import { getFavoriteRecipes } from "@/actions/recipes/getFavoriteRecipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";

export default async function FavoriteRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Receptes preferides">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={getFavoriteRecipes}
      />
    </TitleLayout>
  );
}
