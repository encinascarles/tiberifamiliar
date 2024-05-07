import { createEmptyRecipe } from "@/actions/recipes/createEmptyRecipe";
import { redirect } from "next/navigation";

const NewRecipePage = async () => {
  const id = await createEmptyRecipe();

  if ("error" in id) {
    return { error: id.error };
  }

  redirect(`/receptes/${id.id}/edita?nou=true`);
};

export default NewRecipePage;
