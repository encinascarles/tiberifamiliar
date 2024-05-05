"use client";

import {
  position,
  searchRecipes,
  searchRecipesResponse,
} from "@/actions/recipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipesGrid from "@/components/recipes/RecipesGrid";
import { recipeAndAuthor } from "@/types";
import { useEffect, useRef, useState } from "react";

const InfiniteScrollGrid = ({
  search,
  initialRecipesResponse,
}: {
  search: string;
  initialRecipesResponse: searchRecipesResponse;
}) => {
  if ("error" in initialRecipesResponse) return null;

  const [personalRecipes, setPersonalRecipes] = useState<recipeAndAuthor[]>(
    initialRecipesResponse.recipes.personal
  );
  const [familiesRecipes, setFamiliesRecipes] = useState<recipeAndAuthor[]>(
    initialRecipesResponse.recipes.families
  );
  const [publicRecipes, setPublicRecipes] = useState<recipeAndAuthor[]>(
    initialRecipesResponse.recipes.public
  );
  const [aiRecipes, setAiRecipes] = useState<recipeAndAuthor[]>(
    initialRecipesResponse.recipes.ai
  );
  const position = useRef<position>(initialRecipesResponse.position);

  const [page, setPage] = useState(1);

  const spinnerRef = useRef<HTMLDivElement>(null);

  const loadRecipesTest = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      loadMoreRecipes();
    }
  };

  const loadMoreRecipes = async () => {
    console.log(position.current);
    const recipesResponse = await searchRecipes({
      take: 4,
      query: search,
      position: position.current,
    });
    console.log(recipesResponse);
    if ("error" in recipesResponse) throw new Error(recipesResponse.error);
    position.current = recipesResponse.position;
    setPersonalRecipes((prevRecipes) => [
      ...prevRecipes,
      ...recipesResponse.recipes.personal,
    ]);
    setFamiliesRecipes((prevRecipes) => [
      ...prevRecipes,
      ...recipesResponse.recipes.families,
    ]);
    setPublicRecipes((prevRecipes) => [
      ...prevRecipes,
      ...recipesResponse.recipes.public,
    ]);
    setAiRecipes((prevRecipes) => [
      ...prevRecipes,
      ...recipesResponse.recipes.ai,
    ]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(loadRecipesTest, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    if (spinnerRef.current) observer.observe(spinnerRef.current);
    return () => {
      if (spinnerRef.current) observer.unobserve(spinnerRef.current);
    };
  }, [spinnerRef]);

  return (
    <>
      Personal:
      <RecipesGrid>
        {personalRecipes.map((recipe) => (
          <RecipeCard key={"personal-" + recipe.id} recipe={recipe} />
        ))}
      </RecipesGrid>
      Families:
      <RecipesGrid>
        {familiesRecipes.map((recipe) => (
          <RecipeCard key={"families-" + recipe.id} recipe={recipe} />
        ))}
      </RecipesGrid>
      Public:
      <RecipesGrid>
        {publicRecipes.map((recipe) => (
          <RecipeCard key={"public-" + recipe.id} recipe={recipe} />
        ))}
      </RecipesGrid>
      AI:
      <RecipesGrid>
        {aiRecipes.map((recipe) => (
          <RecipeCard key={"ai-" + recipe.id} recipe={recipe} />
        ))}
      </RecipesGrid>
      <div
        ref={spinnerRef}
        className="col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4"
      >
        <svg
          aria-hidden="true"
          className="h-10 w-10 animate-spin fill-sky-600 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export default InfiniteScrollGrid;
