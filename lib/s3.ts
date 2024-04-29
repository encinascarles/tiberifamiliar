import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_2!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface UploadFileArgs {
  type: string;
  size: number;
  checksum: string;
  metadata: {};
}

export const getUploadFileUrl = async ({
  type,
  size,
  checksum,
  metadata,
}: UploadFileArgs) => {
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: metadata,
  });
  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });
  const fileURL = signedURL.split("?")[0];
  return { signedURL, fileURL };
};

export const deleteFile = async (key: string) => {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key.split("/").pop(),
  });
  await s3.send(deleteObjectCommand);
};
