import { getPersonalRecipes } from "@/actions/recipes";
import ShowRecipesLayout from "@/components/recipes/ShowRecipesLayout";

export default async function PersonalRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ShowRecipesLayout
      pageParams={searchParams.page}
      getRecipes={getPersonalRecipes}
      title="Receptes Personals"
    />
  );
}
