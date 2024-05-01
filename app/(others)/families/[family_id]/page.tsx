"use server";
import { getFamily } from "@/actions/families";
import { EditFamilyButton } from "./EditFamilyButton";
import { LeaveFamilyButton } from "./LeaveFamilyButton";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FamilyRecipesGrid from "./FamilyRecipesGrid";
import MembersCard from "./(MembersCard)/MembersCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface FamilyPageProps {
  params: { family_id: string };
}

const FamilyPage: React.FC<FamilyPageProps> = async ({ params }) => {
  // Fetch family data
  const family = await getFamily(params.family_id);
  if ("error" in family) throw new Error(family.error);

  return (
    <div className="px-4 sm:px-8 container">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4 items-start">
          <Card className="w-full lg:w-8/12">
            <div className="aspect-[4/3] relative">
              <Image
                src={family.image ? family.image : "/default_family.png"}
                fill
                alt="family image"
                objectFit="cover"
                className="rounded-t-lg z-10"
                sizes="(max-width: 1024px) 70vw, 100vw"
                quality={100}
              />
              <Skeleton className="h-full w-full rounded-b-none rounded-t-lg z-0" />
            </div>
            <CardFooter className="pt-4 flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start">
              <h1 className="text-2xl md:text-3xl font-semibold truncate w-full">
                {family.name}
              </h1>
              <div className="gap-2 flex flex-row">
                <LeaveFamilyButton familyId={family.id} />
                {family.admin && (
                  <EditFamilyButton
                    familyId={params.family_id}
                    name={family.name as string}
                    description={family.description as string}
                    image={family.image}
                  />
                )}
              </div>
            </CardFooter>
          </Card>
          <Suspense fallback={<Skeleton className="w-full lg:w-4/12 h-48" />}>
            <MembersCard familyId={family.id} admin={family.admin} />
          </Suspense>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Descripció</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{family.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Receptes</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <FamilyRecipesGrid familyId={family.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FamilyPage;
