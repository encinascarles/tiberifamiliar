"use server";
import { MAX_RECIPE_IMAGE_UPLOAD_SIZE } from "@/config";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { deleteFile, getUploadFileUrl } from "@/lib/s3";
import { error } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Provide a signed URL for the client to upload a recipe image and update the recipe with the new image

//------------------ RESPONSE TYPE ------------------:

export type getRecipeSignedImageURLResponse =
  | { uploadUrl: string; image: string }
  | error;

//------------------ ACTION ------------------:

export async function getRecipeSignedImageURL(
  type: string,
  size: number,
  checksum: string,
  recipeId: string
): Promise<getRecipeSignedImageURLResponse> {
  try {
    // Check if the file is an image
    if (!type.startsWith("image/")) {
      throw new Error("show: Extensió de l'arxiu invalida");
    }

    // Check if the file is too big
    if (size > MAX_RECIPE_IMAGE_UPLOAD_SIZE * 1024 * 1024) {
      throw new Error("show: La imatge ha d'ocupar menys de 3MB");
    }

    // Get current user
    const user = await safeGetSessionUser();

    // Get signed URL
    const { signedURL, fileURL } = await getUploadFileUrl({
      type,
      size,
      checksum,
      metadata: {
        recipeId: recipeId,
      },
    });

    // Update the recipe with the new image and delete the old one
    await db.$transaction(async () => {
      // Make sure the user is the owner of the recipe
      const recipe = await db.recipe.findUnique({
        where: { id: recipeId, authorId: user.id },
      });
      if (!recipe) throw new Error("show: Recepta no trobada");

      // Check if there is already an image for this recipe and delete it
      if (recipe.image) {
        await deleteFile(recipe.image);
      }
      await db.recipe.update({
        where: { id: recipeId },
        data: {
          image: fileURL,
        },
      });
    });
    return { uploadUrl: signedURL, image: fileURL };
  } catch (e: any) {
    return errorHandler(e);
  }
}
