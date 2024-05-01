import { deleteRecipe } from "@/actions/recipes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { recipeAndAuthor } from "@/types";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface DeleteButtonProps {
  recipe: recipeAndAuthor;
  className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ recipe, className }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(() => {
      deleteRecipe(recipe.id).then((response) => {
        if ("error" in response) {
          toast({
            variant: "destructive",
            description: response.error,
          });
          return;
        }
        toast({
          variant: "success",
          description: response.success,
        });
        router.push(`/receptes/personals`);
      });
    });
  };

  return (
    <Button
      className={cn("gap-2", className)}
      variant="secondary"
      onClick={handleClick}
      disabled={isPending}
    >
      <Trash2 size={20} />
      Eliminar
    </Button>
  );
};

export default DeleteButton;
