import RecipeCard from "@/components/RecipeCard";
import AddRecipeCard from "@/components/AddRecipeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function RecipesCarousel() {
  return (
    <Carousel
      className="md:mx-8 2xl:mx-0"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="mr-10 ml-6 md:-ml-4 md:mr-0">
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <RecipeCard />
        </CarouselItem>
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
