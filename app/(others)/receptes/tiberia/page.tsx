import { getAIRecipes } from "@/actions/recipes";
import ShowRecipesLayout from "@/components/ShowRecipesLayout";

export default async function TiberIaRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ShowRecipesLayout
      pageParams={searchParams.page}
      getRecipes={getAIRecipes}
      title="Receptes Generades pel TiberIA"
    />
  );
}
