"use client";

import {
  position,
  searchRecipes,
  searchRecipesResponse,
} from "@/actions/recipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipesGrid from "@/components/recipes/RecipesGrid";
import { recipeAndAuthor } from "@/types";
import { LoaderCircle } from "lucide-react";
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
  const [end, setEnd] = useState(
    initialRecipesResponse.position.place === "end"
  );
  const position = useRef<position>(initialRecipesResponse.position);
  const done = useRef<string[]>(initialRecipesResponse.done);

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
      done: done.current,
    });
    if ("error" in recipesResponse) throw new Error(recipesResponse.error);
    position.current = recipesResponse.position;
    done.current = recipesResponse.done;
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
    setEnd(recipesResponse.position.place === "end");
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
      {!end && (
        <>
          <div ref={spinnerRef} />
          <div className="col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4">
            <LoaderCircle size={40} className="text-orange-500 animate-spin" />
          </div>
        </>
      )}
    </>
  );
};

export default InfiniteScrollGrid;
