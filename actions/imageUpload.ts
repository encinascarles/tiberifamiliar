"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from "crypto";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 3MB

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string,
  recipeId: string
) {
  // Check if the file is an image
  if (!type.startsWith("image/")) {
    return { error: "Nom de l'arxiu invàlid" };
  }
  // Check if the file is too big
  if (size > MAX_UPLOAD_SIZE) {
    return { error: "La imatge ha d'ocupar menys de 3MB" };
  }
  // Get current user
  const user = await currentUser();
  if (!user?.id) return { error: "Usuari no trobat!" };
  // Make sure the user is the owner of the recipe
  const recipe = await db.recipe.findUnique({
    where: { id: recipeId, authorId: user.id },
  });
  if (!recipe) return { error: "Recepta no trobada" };
  // Generate a signed URL
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      recipeId: recipeId,
    },
  });
  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  const imageURL = signedURL.split("?")[0];

  // Check if there is already an image for this recipe and delete it
  if (recipe.image) {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: recipe.image.split("/").pop(),
    });
    await s3.send(deleteObjectCommand);
  }
  // Update the recipe with the new image
  db.recipe
    .update({
      where: { id: recipeId },
      data: {
        image: imageURL,
      },
    })
    .then(() => {}); // I don't know why it's neccessary this then
  return { url: signedURL, imageURL };
}

export async function deleteImage(url: string) {
  //TODO Make sure the user is authenticated
  //TODO Make sure the user owns the image
  //Delete the image from the S3 bucket
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: url.split("/").pop(),
  });
  await s3.send(deleteObjectCommand);
  //Delete the image from the database
  db.recipe.updateMany({
    //TODO Change this to update with recipeId
    where: { image: url },
    data: {
      image: null,
    },
  });
}
