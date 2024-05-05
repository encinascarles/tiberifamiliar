import TitleLayout from "@/components/TitleLayout";
import InfiniteScrollGrid from "./InfiniteScrollGrid";

export default async function SearchRecipesPage() {
  return (
    <TitleLayout title="Cerca">
      <InfiniteScrollGrid />
    </TitleLayout>
  );
}
