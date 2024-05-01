import RecipeCard from "@/components/RecipeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { recipeAndAuthor } from "@/types";

export default async function RecipesCarousel({
  title,
  recipes,
  personal = false,
}: {
  title: string;
  recipes: recipeAndAuthor[];
  personal?: boolean;
}) {
  // If there are no recipes, return null
  if (recipes.length === 0) return null;

  // Return the carousel
  return (
    <div>
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
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
