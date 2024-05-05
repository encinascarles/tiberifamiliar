"use server";
import { MAX_FAMILY_IMAGE_UPLOAD_SIZE } from "@/config";
import { safeGetSessionUser } from "@/lib/auth";
import errorHandler from "@/lib/errorHandler";
import { getUploadFileUrl } from "@/lib/s3";
import { error } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Provide a signed URL for the client to upload a family

//------------------ RESPONSE TYPE ------------------:

export type getFamilySignedImageURLResponse =
  | { uploadUrl: string; image: string }
  | error;

//------------------ ACTION ------------------:

export async function getFamilySignedImageURL(
  type: string,
  size: number,
  checksum: string
): Promise<getFamilySignedImageURLResponse> {
  try {
    // Check if the file is an image
    if (!type.startsWith("image/")) {
      throw new Error("show: Extensió de l'arxiu invalida");
    }

    // Check if the file is too big
    if (size > MAX_FAMILY_IMAGE_UPLOAD_SIZE * 1024 * 1024) {
      throw new Error(
        `show: La imatge ha d'ocupar menys de ${MAX_FAMILY_IMAGE_UPLOAD_SIZE}MB`
      );
    }

    // Check if the user is logged in
    await safeGetSessionUser();

    // Get signed URL
    const { signedURL, fileURL } = await getUploadFileUrl({
      type,
      size,
      checksum,
      metadata: "familyImage",
    });

    return { uploadUrl: signedURL, image: fileURL };
  } catch (e: any) {
    return errorHandler(e);
  }
}
