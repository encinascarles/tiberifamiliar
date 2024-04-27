"use server";

import { MAX_UPLOAD_SIZE } from "@/schemas";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from "crypto";

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
  checksum: string
) {
  //TODO Make sure the user is authenticated
  const PutObjctCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: "1234", //TODO
    },
  });

  const signedURL = await getSignedUrl(s3, PutObjctCommand, {
    expiresIn: 60,
  });

  if (!type.startsWith("image/")) {
    return { error: "Nom de l'arxiu invàlid" };
  }

  if (size > MAX_UPLOAD_SIZE) {
    return { error: "La imatge ha d'ocupar menys de 3MB" };
  }

  return { url: signedURL };
}
