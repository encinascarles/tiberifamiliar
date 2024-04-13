import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";

const AddRecipeCard = () => (
  <Card className="flex items-center justify-center text-4xl text-orange-500 cursor-pointer hover:bg-orange-100 min-h-96">
    <Plus className="w-40 h-40" />
  </Card>
);

export default AddRecipeCard;
