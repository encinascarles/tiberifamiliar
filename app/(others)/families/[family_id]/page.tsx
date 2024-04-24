import { getFamily } from "@/actions/families";
import { getFamilyRecipes } from "@/actions/recipes";
import { EditFamilyButton } from "@/app/(others)/families/[family_id]/EditFamilyButton";
import { InviteUserButton } from "@/app/(others)/families/[family_id]/InviteUserButton";
import { LeaveFamilyButton } from "@/app/(others)/families/[family_id]/LeaveFamilyButton";
import RecipesGrid from "@/components/RecipesGrid";
import UserScroll from "@/app/(others)/families/[family_id]/UserScroll";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

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
                <LeaveFamilyButton familyId={params.family_id} />
                {admin && (
                  <EditFamilyButton
                    familyId={params.family_id}
                    name={family?.name as string}
                    description={family?.description as string}
                  />
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
                {admin && <InviteUserButton familyId={params.family_id} />}
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
        {recipes && recipes.length > 0 && <RecipesGrid recipes={recipes} />}
      </div>
    </div>
  );
}
