import { deleteRecipeImage, getRecipeSignedImageURL } from "@/actions/recipes";
import React from "react";
import ImageDropZone from "@/components/ImageDropZone";

const maxFileSize = 5; // 5MB

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
      maxFileSize={maxFileSize}
      getUploadUrl={(fileType: string, fileSize: number, checksum: string) =>
        getRecipeSignedImageURL(fileType, fileSize, checksum, recipeId)
      }
      deleteImage={deleteRecipeImage}
    />
  );
};
