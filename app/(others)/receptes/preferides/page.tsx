import FavoriteRecipesGrid from "./FavoriteRecipesGrid";

export default async function FavoriteRecipesPage() {
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">Receptes Preferides</h1>
      </div>
      <FavoriteRecipesGrid />
    </div>
  );
}
