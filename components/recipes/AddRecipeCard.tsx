import { Card } from "../ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AddRecipeCard = () => (
  <Link href="/receptes/nova">
    <Card className="flex items-center justify-center text-4xl text-orange-500 cursor-pointer hover:bg-orange-100 min-h-96 h-full">
      <Plus className="w-40 h-40" />
    </Card>
  </Link>
);

export default AddRecipeCard;