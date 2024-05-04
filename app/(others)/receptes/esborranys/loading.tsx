import TitleLayout from "@/components/TitleLayout";
import ShowRecipesPagesSkeleton from "@/components/recipes/ShowRecipesPagesSkeleton";
import DraftGridLayout from "./DraftGridLayout";
import DraftCardSkeleton from "@/components/recipes/DraftCardSkeleton";

const ShowFamiliesRecipesLoadingPage = () => {
  return (
    <TitleLayout title="Esborranys">
      <DraftGridLayout>
        {[...Array(12)].map((_, index) => (
          <DraftCardSkeleton key={index} />
        ))}
      </DraftGridLayout>
    </TitleLayout>
  );
};

export default ShowFamiliesRecipesLoadingPage;
