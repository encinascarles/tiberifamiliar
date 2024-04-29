import {
  getFamiliesRecipes,
  getPersonalRecipes,
  getPublicRecipes,
} from "@/actions/recipes";
import RecipeCard from "../../../../components/RecipeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../components/ui/carousel";

export default async function RecipesCarousel({
  type,
}: {
  type: "personal" | "families" | "public";
}) {
  let recipes;
  if (type === "personal") {
    recipes = await getPersonalRecipes();
  } else if (type === "families") {
    recipes = await getFamiliesRecipes();
  } else {
    recipes = await getPublicRecipes();
  }
  if ("error" in recipes) return null;
  if (recipes.length === 0) return null;

  return (
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
            <RecipeCard
              key={i}
              title={recipe.title}
              id={recipe.id}
              user_image={recipe.author_image}
              user_name={recipe.author_name}
              prep_time={recipe.prep_time}
              total_time={recipe.total_time}
              image={recipe.image}
              personal={type === "personal"}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
