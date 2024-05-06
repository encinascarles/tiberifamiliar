import { getFamiliesRecipes } from "@/actions/recipes/getFamiliesRecipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

export default async function FamiliesRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Receptes dels teus familiars">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={getFamiliesRecipes}
        notFound={
          <div className="space-y-4">
            <p>No tens familiars amb receptes</p>
            <div>
              <Link href="/families">
                <Button className="gap-2">
                  <Users size={20} />
                  Gestiona les families
                </Button>
              </Link>
            </div>
          </div>
        }
      />
    </TitleLayout>
  );
}
