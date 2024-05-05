import { searchRecipes } from "@/actions/recipes";
import TitleLayout from "@/components/TitleLayout";
import InfiniteScrollGrid from "./InfiniteScrollGrid";

export default async function SearchRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  if (!searchParams.search) return null;
  const recipesResponse = await searchRecipes({
    take: 4,
    query: searchParams.search,
  });
  console.log(recipesResponse);
  if ("error" in recipesResponse) return null;
  return (
    <TitleLayout title="Cerca">
      <InfiniteScrollGrid
        search={searchParams.search}
        initialRecipesResponse={recipesResponse}
      />
    </TitleLayout>
  );
}
