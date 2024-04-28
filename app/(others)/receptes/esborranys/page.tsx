import DraftRecipesGrid from "./DraftRecipesGrid";

export default async function DraftRecipesPage() {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Esborranys</h1>
      <DraftRecipesGrid />
    </div>
  );
}