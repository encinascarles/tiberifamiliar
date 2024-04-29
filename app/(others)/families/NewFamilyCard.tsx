import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

const NewFamilyCard = () => {
  return (
    <Link href="/families/nova">
      <Card className="flex items-center justify-center text-4xl text-orange-500 cursor-pointer hover:bg-orange-100 w-full md:w-[600px] h-[180px]">
        <Plus className="w-40 h-40" />
      </Card>
    </Link>
  );
};

export default NewFamilyCard;
