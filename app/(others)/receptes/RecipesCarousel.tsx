import {
  getFamiliesRecipes,
  getPersonalRecipes,
  getPublicRecipes,
} from "@/actions/recipes";
import RecipeCard from "../../../components/RecipeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";

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
  return (
    <Carousel
      className="md:mx-8 2xl:mx-0"
      opts={{
        align: "start",
        //loop: true,
      }}
    >
      <CarouselContent className="mr-10 ml-6 md:-ml-4 md:mr-0">
        {recipes &&
          recipes.map((recipe, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
              <RecipeCard
                key={i}
                title={recipe.title}
                id={recipe.id}
                username={recipe.author.username as string}
                user_image={recipe.author.image as string}
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
