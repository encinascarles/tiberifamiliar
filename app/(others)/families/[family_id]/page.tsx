import { getFamiliesRecipes, getFamilyRecipes } from "@/actions/recipes";
import RecipeCard from "@/components/RecipeCard";
import UserScroll from "@/components/UserScroll";
import { Button } from "@/components/ui/button";
import { LogOut, Pencil, UserPlus } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { getFamily } from "@/actions/families";

export default async function FamilyPage({
  params,
}: {
  params: { family_id: string };
}) {
  const recipesResponse = await getFamilyRecipes(params.family_id);
  const recipes = recipesResponse?.recipes;
  const familyResponse = await getFamily(params.family_id);
  const family = familyResponse?.family;
  const admin = familyResponse?.admin;
  return (
    <div className="container">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4 items-start">
          <Card className="w-full lg:w-8/12">
            <div className="aspect-[4/3] relative">
              <Image
                src="/demo_images/family.png"
                fill
                alt="family image"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <CardFooter className="pt-4 flex justify-between">
              <h1 className="text-3xl font-semibold">{family?.name}</h1>
              <div className="space-x-2">
                <Button className="gap-2">
                  <LogOut className="w-5 h-5" />
                  Surt
                </Button>
                {admin && (
                  <Button className="gap-2">
                    <Pencil className="w-5 h-5" />
                    Edita la familia
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
          <Card className="w-full lg:w-4/12">
            <CardHeader>
              <CardTitle>Membres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <UserScroll familyId={params.family_id} />
                {admin && (
                  <Button className="mt-4 mx-4 gap-2">
                    <UserPlus className="w-5 h-5" /> Convida un nou membre
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Descripció</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{family?.description}</p>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
          {recipes &&
            recipes.map((recipe, i) => (
              <RecipeCard
                key={i}
                title={recipe.title}
                id={recipe.id}
                username={recipe.author.username as string}
                user_image={recipe.author.image as string}
                prep_time={recipe.prep_time}
                total_time={recipe.total_time}
                image={recipe.image}
                personal={false}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
