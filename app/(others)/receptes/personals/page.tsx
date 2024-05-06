import { getPersonalRecipes } from "@/actions/recipes/getPersonalRecipes";
import TitleLayout from "@/components/TitleLayout";
import RecipesGridWithPagination from "@/components/recipes/ShowRecipesLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function PersonalRecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <TitleLayout title="Receptes personals">
      <RecipesGridWithPagination
        pageParams={searchParams.page}
        getRecipes={getPersonalRecipes}
        notFound={
          <div className="space-y-4">
            <p>Encara no tens cap recepta propia</p>
            <div>
              <Link href="/receptes/nova">
                <Button className="gap-2">
                  <Plus size={20} />
                  Crea la teva primera recepta
                </Button>
              </Link>
            </div>
          </div>
        }
      />
    </TitleLayout>
  );
}
