import BigSearchBox from "./BigSearchBox";
import InfiniteScrollGrid from "./InfiniteScrollGrid";

export default async function SearchRecipesPage() {
  return (
    <div className="container mt-10 space-y-10">
      <BigSearchBox />
      <InfiniteScrollGrid />
    </div>
  );
}
