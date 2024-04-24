"use server";
import { getFamily } from "@/actions/families";
import { EditFamilyButton } from "@/app/(others)/families/[family_id]/EditFamilyButton";
import { LeaveFamilyButton } from "@/app/(others)/families/[family_id]/LeaveFamilyButton";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import FamilyRecipesGrid from "./FamilyRecipesGrid";
import MembersCard from "./(MembersCard)/MembersCard";

interface FamilyPageProps {
  params: { family_id: string };
}

const FamilyPage: React.FC<FamilyPageProps> = async ({ params }) => {
  const familyId = params.family_id;

  const familyResponse = await getFamily(familyId);
  const family = familyResponse?.family;
  const admin = familyResponse?.admin ? true : false;

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
          <MembersCard familyId={params.family_id} admin={admin} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Descripció</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{family?.description}</p>
          </CardContent>
        </Card>

        <FamilyRecipesGrid familyId={familyId} />
      </div>
    </div>
  );
};

export default FamilyPage;
