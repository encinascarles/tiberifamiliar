import { redirect } from "next/navigation";
import { createEmptyRecipe } from "@/actions/recipes";

const NewRecipePage = async () => {
  const id = await createEmptyRecipe();

  if ("error" in id) {
    return { error: id.error };
  }

  redirect(`/receptes/${id.id}/edita?nou=true`);

  return;
};

export default NewRecipePage;
