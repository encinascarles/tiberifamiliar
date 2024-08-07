import RecipeCard from "@/components/recipes/RecipeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { recipeAndAuthor } from "@/types";
import SeeMoreCard from "./SeeMoreCard";

export default async function RecipesCarousel({
  title,
  recipes,
  personal = false,
  className,
}: {
  title: string;
  recipes: recipeAndAuthor[];
  personal?: boolean;
  className?: string;
}) {
  // If there are no recipes, return null
  if (recipes.length === 0) return null;

  // Return the carousel
  return (
    <div className={className}>
      <h1 className="ml-8 2xl:ml-0 text-4xl font-bold my-10 mr-10">{title}</h1>
      <Carousel
        className="md:mx-8 2xl:mx-0"
        opts={{
          align: "start",
          //loop: true,
        }}
      >
        <CarouselContent className="mr-10 ml-6 md:-ml-4 md:mr-0">
          {recipes.map((recipe, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
              <RecipeCard key={i} recipe={recipe} personal={personal} />
            </CarouselItem>
          ))}
          {recipes.length === 20 && (
            <CarouselItem key={"jkds"} className="md:basis-1/2 lg:basis-1/3">
              <SeeMoreCard />
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
