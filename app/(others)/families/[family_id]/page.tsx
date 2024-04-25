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

  const family = await getFamily(familyId);
  if (family.error || !family.data) return null;

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
              <h1 className="text-3xl font-semibold">{family.data.name}</h1>
              <div className="space-x-2">
                <LeaveFamilyButton familyId={params.family_id} />
                {family.data.admin && (
                  <EditFamilyButton
                    familyId={params.family_id}
                    name={family.data.name as string}
                    description={family.data.description as string}
                  />
                )}
              </div>
            </CardFooter>
          </Card>
          <MembersCard familyId={family.data.id} admin={family.data.admin} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Descripció</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{family.data.description}</p>
          </CardContent>
        </Card>

        <FamilyRecipesGrid familyId={familyId} />
      </div>
    </div>
  );
};

export default FamilyPage;
