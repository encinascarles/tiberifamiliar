import { getPublicRecipes } from "@/actions/recipes/getPublicRecipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";

export default async function PublicRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Receptes Publiques">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={getPublicRecipes}
        notFound={<p>No hi ha cap recepta publica</p>}
      />
    </TitleLayout>
  );
}
