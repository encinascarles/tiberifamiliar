import { deleteRecipeImage, getRecipeSignedImageURL } from "@/actions/recipes";
import React from "react";
import ImageDropZone from "@/components/ImageDropZone";
import { MAX_RECIPE_IMAGE_UPLOAD_SIZE } from "@/config";

interface ImageDropzoneProps {
  image?: string | null;
  recipeId: string;
}

export const RecipeImageDropZone: React.FC<ImageDropzoneProps> = ({
  image,
  recipeId,
}) => {
  return (
    <ImageDropZone
      text="Adjunta una foto del plat"
      image={image}
      maxFileSize={MAX_RECIPE_IMAGE_UPLOAD_SIZE}
      getUploadUrl={(fileType: string, fileSize: number, checksum: string) =>
        getRecipeSignedImageURL(fileType, fileSize, checksum, recipeId)
      }
      deleteImage={deleteRecipeImage}
    />
  );
};
