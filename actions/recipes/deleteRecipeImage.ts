"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { deleteFile } from "@/lib/s3";
import { actionResponse } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Delete recipe image

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export async function deleteRecipeImage(url: string): Promise<actionResponse> {
  try {
    // Get user
    const user = await safeGetSessionUser();

    await db.$transaction(async () => {
      // Make sure the user owns the image
      const recipe = await db.recipe.findFirst({
        where: { image: url },
      });
      if (!recipe) throw new Error("show: Imatge no trobada");
      if (recipe.authorId !== user.id)
        throw new Error("show: No autoritzat per eliminar la imatge");

      // Delete the image from the database
      await db.recipe.update({
        where: { id: recipe.id },
        data: {
          image: null,
        },
      });

      // Delete the image from the S3 bucket
      await deleteFile(url);
    });
    return { success: "Imatge eliminada amb èxit" };
  } catch (e: any) {
    return errorHandler(e);
  }
}
