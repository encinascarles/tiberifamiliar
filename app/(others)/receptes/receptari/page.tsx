import { getAIRecipes } from "@/actions/recipes/getAiRecipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";

export default async function TiberIaRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Receptari de receptes generades per IA">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={getAIRecipes}
        notFound={<p>No hi ha cap recepta de tiberIA</p>}
      />
    </TitleLayout>
  );
}
