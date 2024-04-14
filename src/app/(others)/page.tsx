import RecipesCarousel from "@/components/RecipesCarousel";

export default function HomePage() {
  return (
    <div className="md:container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="ml-8 2xl:ml-0 text-4xl font-bold my-10 mr-10">
          Receptes Personals
        </h1>
      </div>
      <RecipesCarousel personal />
      <div className="flex justify-start items-center gap-6">
        <h1 className="ml-8 2xl:ml-0 text-4xl font-bold my-10 mr-10">
          Receptes Familiars
        </h1>
      </div>
      <RecipesCarousel />
      <div className="flex justify-start items-center gap-6">
        <h1 className="ml-8 2xl:ml-0 text-4xl font-bold my-10 mr-10">
          Receptes Publiques
        </h1>
      </div>
      <RecipesCarousel />
    </div>
  );
}