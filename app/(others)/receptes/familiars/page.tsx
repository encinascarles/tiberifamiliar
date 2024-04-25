import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FamiliesRecipesGrid from "./FamiliesRecipesGrid";

export default async function FamiliesRecipesPage() {
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">Receptes Familiars</h1>
        {Array.from({ length: 6 }).map((_, i) => (
          <Link key={i} href="/families/_family_id_">
            <Avatar className="cursor-pointer h-14 w-14">
              <AvatarImage src="/default_user.jpg" />
            </Avatar>
          </Link>
        ))}
        <Link href="/families">
          <Avatar className="cursor-pointer h-14 w-14">
            <AvatarFallback>
              <Ellipsis />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <FamiliesRecipesGrid />
    </div>
  );
}
