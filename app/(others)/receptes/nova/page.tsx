import { createEmptyRecipe } from "@/actions/recipes/createEmptyRecipe";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NewRecipePage = async () => {
  // Disable caching here
  const _cookies = cookies();

  const id = await createEmptyRecipe();

  if ("error" in id) {
    return { error: id.error };
  }

  redirect(`/receptes/${id.id}/edita?nou=true`);
};

export default NewRecipePage;
