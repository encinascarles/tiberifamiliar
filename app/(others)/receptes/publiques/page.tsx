import PublicRecipesGrid from "./PublicRecipesGrid";

export default async function PublicRecipesPage() {
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">Receptes Publiques</h1>
      </div>
      <PublicRecipesGrid />
    </div>
  );
}
