"use client";
import { getRecipeSignedImageURLResponse } from "@/actions/recipes/getRecipeSignedImageURL";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { computeSHA256 } from "@/lib/utils";
import { actionResponse } from "@/types";
import { ImagePlus, LoaderCircle, SquarePlus, TrashIcon } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface ImageDropzoneProps {
  text?: string;
  image?: string | null;
  setImageUrl?: (arg0: string) => void;
  maxFileSize?: number;
  getUploadUrl: (
    arg0: string,
    arg1: number,
    arg3: string
  ) => Promise<getRecipeSignedImageURLResponse>;
  deleteImage: (arg0: string) => Promise<actionResponse>;
}

const ImageDropZone: React.FC<ImageDropzoneProps> = ({
  text,
  image,
  setImageUrl,
  maxFileSize,
  getUploadUrl,
  deleteImage,
}) => {
  // Reference to the file input element to pass in clicks
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State to manage drag and drop events
  const [isDragOver, setIsDragOver] = useState(false);

  // State to manage the image to be displayed
  const [imageSrc, setImageSrc] = useState<string | null>(image!!);

  // State to manage errors and loading state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    const { files } = e.dataTransfer;
    handleFile(files[0]);
  };

  // Click event handler
  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFile(files[0]);
    }
  };
  const handleFile = async (file: File) => {
    // Check if user provided an image (necessary when you drop a file in the dropzone without clicking the input)
    if (!file.type.startsWith(`image/`)) {
      setError(`Format d'imatge no vàlid`);
      return;
    }

    // Check if the image is too big
    const fileSizeInKB = Math.round(file.size / 1024);
    if (maxFileSize && fileSizeInKB > maxFileSize * 1024) {
      setError(`La imatge ha d'ocupar menys de ${maxFileSize} MB`);
      return;
    }

    // Reset error and loading state
    setError(null);
    setIsLoading(true);

    // Compute checksum and get signed URL
    const checksum = await computeSHA256(file);
    const signedURL = await getUploadUrl(file.type, file.size, checksum);

    // Check if there was an error getting the signed URL
    if ("error" in signedURL) {
      setIsLoading(false);
      setError("Error pujant la Imatge");
      return;
    }

    // Upload image to S3
    try {
      await fetch(signedURL.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
    } catch {
      setIsLoading(false);
      setError("Error pujant la imatge");
      return;
    }

    // Set image source
    setImageSrc(signedURL.image);
    if (setImageUrl) setImageUrl(signedURL.image);

    setIsLoading(false);
  };

  // Handle delete image
  const handleDelete = async () => {
    // Only delete if there is an image
    if (imageSrc) {
      setImageSrc(null);
      await deleteImage(imageSrc);
    }
  };

  return (
    <>
      {imageSrc || isLoading ? (
        <Card className="w-full aspect-[4/3] relative">
          {imageSrc && (
            <>
              {" "}
              <Image
                src={imageSrc}
                alt="Imatge del plat"
                fill
                className="object-cover w-full h-full rounded-lg z-10"
              />
              <Button
                className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/50 z-20"
                size="icon"
                variant="ghost"
                onClick={() => handleDelete()}
              >
                {" "}
                <TrashIcon className="text-white" />{" "}
              </Button>
            </>
          )}
          <div className="w-full aspect-[4/3] flex items-center justify-center z-0">
            <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
          </div>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${
            isDragOver ? "border-muted-foreground/50" : ""
          }`}
          onClick={handleDropzoneClick}
        >
          <CardContent
            className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-center text-muted-foreground">
              <span className="font-medium flex items-center gap-4">
                {isDragOver ? (
                  <>
                    <SquarePlus /> Deixa anar l&apos;arxiu
                  </>
                ) : (
                  <>
                    <ImagePlus /> {text ? text : "Adjunta una foto"}
                  </>
                )}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept={`image/*`}
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
            {error && <span className="text-red-500">{error}</span>}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ImageDropZone;
