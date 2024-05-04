import TitleLayout from "@/components/TitleLayout";
import DraftRecipesGrid from "./DraftRecipesGrid";

export default async function DraftRecipesPage() {
  return (
    <TitleLayout title="Esborranys">
      <DraftRecipesGrid />
    </TitleLayout>
  );
}
