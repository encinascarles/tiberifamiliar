"use client";
import { position, searchRecipes } from "@/actions/recipes/searchRecipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipesGrid from "@/components/recipes/RecipesGrid";
import { recipeAndAuthor } from "@/types";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const InfiniteScrollGrid = () => {
  const searchParams = useSearchParams();

  const [personalRecipes, setPersonalRecipes] = useState<recipeAndAuthor[]>([]);
  const [familiesRecipes, setFamiliesRecipes] = useState<recipeAndAuthor[]>([]);
  const [publicRecipes, setPublicRecipes] = useState<recipeAndAuthor[]>([]);
  const [aiRecipes, setAiRecipes] = useState<recipeAndAuthor[]>([]);
  const [end, setEnd] = useState(true);
  const [loading, setLoading] = useState(true);
  const position = useRef<position>({ place: "personal", num: 0 });
  const done = useRef<string[]>([]);
  const [ref, inView] = useInView();

  const loadMoreRecipes = useCallback(async () => {
    const recipesResponse = await searchRecipes({
      take: 4,
      query: searchParams.get("search")!,
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
  }, [searchParams]); // Asegúrate de incluir todas las dependencias necesarias aquí

  useEffect(() => {
    setLoading(true);
    searchRecipes({
      take: 4,
      query: searchParams.get("search")!,
    }).then((response) => {
      if ("error" in response) throw new Error(response.error);
      setLoading(false);
      setPersonalRecipes(response.recipes.personal);
      setFamiliesRecipes(response.recipes.families);
      setPublicRecipes(response.recipes.public);
      setAiRecipes(response.recipes.ai);
      position.current = response.position;
      done.current = response.done;
      setEnd(response.position.place === "end");
    });
  }, [searchParams, loadMoreRecipes]);

  useEffect(() => {
    if (inView) {
      loadMoreRecipes();
    }
  }, [inView, loadMoreRecipes]);

  return (
    <>
      {loading ? (
        <div className="col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4">
          <LoaderCircle size={40} className="text-orange-500 animate-spin" />
        </div>
      ) : (
        <>
          {" "}
          Personal:
          <RecipesGrid>
            {personalRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </RecipesGrid>
          Families:
          <RecipesGrid>
            {familiesRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </RecipesGrid>
          Public:
          <RecipesGrid>
            {publicRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </RecipesGrid>
          AI:
          <RecipesGrid>
            {aiRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </RecipesGrid>
          {!end && (
            <div
              ref={ref}
              className="col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4"
            >
              <LoaderCircle
                size={40}
                className="text-orange-500 animate-spin"
              />
            </div>
          )}{" "}
        </>
      )}
    </>
  );
};

export default InfiniteScrollGrid;
