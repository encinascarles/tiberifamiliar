import TitleLayout from "@/components/TitleLayout";
import RecipeCardSkeleton from "@/components/recipes/RecipeCardSkeleton";
import RecipesGrid from "@/components/recipes/RecipesGrid";

const ShowRecipesPagesSkeleton = ({ title }: { title: string }) => {
  return (
    <TitleLayout title={title}>
      <RecipesGrid>
        {[...Array(12)].map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </RecipesGrid>
    </TitleLayout>
  );
};

export default ShowRecipesPagesSkeleton;
