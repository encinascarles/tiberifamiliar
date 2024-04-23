import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const NewRecipeButton = () => {
  return (
    <Link href="/receptes/nova">
      <Button className="rounded-full w-9 h-9 p-0">
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
};

export default NewRecipeButton;
