import TiberIaRecipesGrid from "./TiberIaRecipesGrid";

export default async function TiberIaRecipesPage() {
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">
          Receptes Generades pel TiberIA
        </h1>
      </div>
      <TiberIaRecipesGrid />
    </div>
  );
}
