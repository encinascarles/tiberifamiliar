import { getAIRecipes } from "@/actions/recipes";
import RecipesGrid from "@/components/RecipesGrid";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function TiberIaRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const take = 18;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const recipeResponse = await getAIRecipes(page, take);
  if ("error" in recipeResponse) return null;
  const recipes = recipeResponse.recipes;
  const totalPages = Math.ceil(recipeResponse.total / take);
  console.log(totalPages);

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
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">
          Receptes Generades pel TiberIA
        </h1>
      </div>
      <RecipesGrid recipes={recipes} />
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            {}
            <PaginationPrevious
              title="Anterior"
              href={page > 1 ? `?page=${page - 1}` : "#"}
            />
          </PaginationItem>
          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={`?page=${pageNumber}`}
                isActive={pageNumber === page}
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
              href={page < totalPages ? `?page=${page + 1}` : "#"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
