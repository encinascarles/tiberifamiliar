import { getAIRecipes } from "@/actions/recipes/getAiRecipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";

export default async function TiberIaRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Receptes Generades pel TiberIA">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={getAIRecipes}
      />
    </TitleLayout>
  );
}
