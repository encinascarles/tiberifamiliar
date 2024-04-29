import { deleteFamilyImage, getFamilySignedImageURL } from "@/actions/families";
import ImageDropZone from "@/components/ImageDropZone";
import { MAX_FAMILY_IMAGE_UPLOAD_SIZE } from "@/config";
import React from "react";

interface ImageDropzoneProps {
  imageUrl: string | null | undefined;
  setImageUrl: (arg0: string) => void;
}

const FamilyImageDropZone: React.FC<ImageDropzoneProps> = ({
  imageUrl,
  setImageUrl,
}) => {
  return (
    <ImageDropZone
      image={imageUrl}
      setImageUrl={setImageUrl}
      text="Adjunta una foto de la familia"
      maxFileSize={MAX_FAMILY_IMAGE_UPLOAD_SIZE}
      getUploadUrl={getFamilySignedImageURL}
      deleteImage={deleteFamilyImage}
    />
  );
};

export default FamilyImageDropZone;
