"use client";
import { deleteRecipe } from "@/actions/recipes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { recipeAndAuthor } from "@/types";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps {
  recipe_id: string;
  className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  recipe_id,
  className,
}) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(() => {
      deleteRecipe(recipe_id).then((response) => {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={cn("gap-2", className)}
          variant="secondary"
          disabled={isPending}
        >
          <Trash2 size={20} />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Estàs segur que vols eliminar la recepta?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aquesta acció borrará la recepta de forma permanent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel·la</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continua</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
