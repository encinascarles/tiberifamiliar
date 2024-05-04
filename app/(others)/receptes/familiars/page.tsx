import { getFamiliesRecipes } from "@/actions/recipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";

export default async function FamiliesRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Receptes dels teus familiars">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={getFamiliesRecipes}
      />
    </TitleLayout>
  );
}
