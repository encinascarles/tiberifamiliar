import { getPersonalRecipes } from "@/actions/recipes/getPersonalRecipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";

export default async function PersonalRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Receptes personals">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={getPersonalRecipes}
      />
    </TitleLayout>
  );
}
