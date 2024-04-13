import RecipeCard from "@/components/RecipeCard";

export default function PublicRecipesPage() {
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">Receptes Publiques</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <RecipeCard key={i} />
        ))}
      </div>
    </div>
  );
}
