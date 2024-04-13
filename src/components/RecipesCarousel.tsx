import RecipeCard from "@/components/RecipeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function RecipesCarousel({
  personal = false,
}: {
  personal?: boolean;
}) {
  return (
    <Carousel
      className="md:mx-8 2xl:mx-0"
      opts={{
        align: "start",
        //loop: true,
      }}
    >
      <CarouselContent className="mr-10 ml-6 md:-ml-4 md:mr-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
            <RecipeCard personal={personal} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
