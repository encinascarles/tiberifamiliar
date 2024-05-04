import { searchRecipes } from "@/actions/recipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";

export default async function SearchRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Cerca">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={searchRecipes}
        search={searchParams.search}
      />
    </TitleLayout>
  );
}
