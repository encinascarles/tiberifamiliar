import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import Image from "next/image";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../../components/ui/avatar";
import { Checkbox } from "../../../../components/ui/checkbox";
import { getRecipe } from "@/actions/recipes";

export default async function ShowRecipePage({
  params,
}: {
  params: { recipe_id: string };
}) {
  const response = await getRecipe(params.recipe_id);
  let recipe;
  if (response.error) {
    return <div>{response.error}</div>;
  } else {
    recipe = response.recipe;
  }
  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">{recipe?.title}</h1>
      <Card>
        <div className="flex flex-col md:flex-row justify-stretch ">
          <Image
            src={recipe?.image ? recipe.image : "/demo_images/recipe_image.jpg"}
            height="800"
            width="800"
            alt="recipe image"
            className="rounded-t-md md:rounded-none md:rounded-l-md  md:w-8/12 aspect-square"
          />
          <div className="flex flex-col p-6 gap-2 md:w-4/12">
            <h1 className="text-lg">
              <b>Temps de Preparació:</b> {recipe?.prep_time}min
            </h1>
            <h1 className="text-lg">
              <b>Temps de Total:</b> {recipe?.total_time}min
            </h1>

            <h1 className="text-lg md:hidden lg:block">
              <b>Recomanacions:</b> {recipe?.recommendations}
            </h1>
            <h1 className="text-lg md:hidden lg:block">
              <b>Procedència:</b> {recipe?.origin}
            </h1>

            <div className="flex gap-4 items-center w-full justify-center border-t-2 pt-4">
              <Avatar className="cursor-pointer h-12 w-12">
                <AvatarImage src="/default_user.jpg" />
              </Avatar>
              <h1 className="font-bold">Feta per {recipe?.author.name}</h1>
            </div>
          </div>
        </div>
        <h1 className="text-xl hidden md:block lg:hidden">
          <b>Recomanacions:</b> {recipe?.recommendations}
        </h1>
        <h1 className="text-xl hidden md:block lg:hidden">
          <b>Procedència:</b> {recipe?.origin}
        </h1>
      </Card>
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-none">
            {recipe?.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-center gap-2 text-lg my-3">
                <Checkbox className="w-6 h-6" />
                {ingredient}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardHeader>
          <CardTitle>Preparació</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-outside pl-6 marker:text-orange-600 marker:font-extrabold marker:text-2xl ml-4 ">
            {recipe?.steps.map((step, i) => (
              <li key={i} className="text-lg my-3">
                {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
