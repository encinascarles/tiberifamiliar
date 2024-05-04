import { getPaginationRecipesResponse } from "@/actions/recipes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddRecipeCard from "./AddRecipeCard";
import RecipeCard from "./RecipeCard";
import RecipesGrid from "./RecipesGrid";

export default async function RecipesGridWithPagination({
  pageParams,
  getRecipes,
  addRecipe,
  personal,
  search,
}: {
  pageParams: string | string[] | undefined;
  getRecipes: (
    page: number,
    take: number,
    search?: string
  ) => Promise<getPaginationRecipesResponse>;
  addRecipe?: boolean;
  personal?: boolean;
  search?: string | string[] | undefined;
}) {
  const take = 18;
  const page = pageParams ? Number(pageParams) : 1;
  let recipeResponse;
  if (search) {
    recipeResponse = await getRecipes(page, take, search as string);
  } else {
    recipeResponse = await getRecipes(page, take);
  }
  if ("error" in recipeResponse) return null;
  const recipes = recipeResponse.recipes;
  const totalPages = Math.ceil(recipeResponse.total / take);

  // Calculate the start and end page numbers for the pagination
  let startPage = Math.max(page - 2, 1);
  let endPage = Math.min(startPage + 4, totalPages);

  // Adjust the start page if we're at the end of the pagination
  if (endPage - startPage < 4) {
    startPage = Math.max(endPage - 4, 1);
  }

  // Generate the page numbers for the pagination
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <>
      <RecipesGrid>
        {addRecipe && <AddRecipeCard />}
        {recipes.map((recipe, i) => (
          <RecipeCard key={i} recipe={recipe} personal={personal} />
        ))}
      </RecipesGrid>
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              {}
              <PaginationPrevious
                title="Anterior"
                className="text-orange-500"
                href={
                  page > 1 ? `?page=${page - 1}&search=${search || ""}` : "#"
                }
              />
            </PaginationItem>
            {pageNumbers.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={`?page=${pageNumber}&search=${search || ""}`}
                  isActive={pageNumber === page}
                  className="border-orange-500"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              {endPage < totalPages && <PaginationEllipsis />}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                title="Següent"
                className="text-orange-500"
                href={
                  page < totalPages
                    ? `?page=${page + 1}&search=${search || ""}`
                    : "#"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
