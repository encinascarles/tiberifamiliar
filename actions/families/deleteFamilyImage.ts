"use server";
import { safeGetSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import errorHandler from "@/lib/errorHandler";
import { deleteFile } from "@/lib/s3";
import { actionResponse } from "@/types";

//------------------ DESCRIPTION ------------------:

// - Delete family image

//------------------ RESPONSE TYPE ------------------:

// TYPE: actionResponse = error | success;

//------------------ ACTION ------------------:

export async function deleteFamilyImage(url: string): Promise<actionResponse> {
  try {
    // Get user
    const user = await safeGetSessionUser();

    await db.$transaction(async () => {
      // Make sure the user owns the image
      const family = await db.family.findFirst({
        where: { image: url },
        include: {
          members: {
            where: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
      });

      // If it's not associated with a family, delete the image
      if (!family) {
        await deleteFile(url);
        return;
      }

      if (family.members.length === 0)
        throw new Error("show: No autoritzat per eliminar la imatge");

      // Delete the image from the database
      await db.family.update({
        where: { id: family.id },
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
