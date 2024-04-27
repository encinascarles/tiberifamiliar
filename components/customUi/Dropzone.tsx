import { deleteImage, getSignedURL } from "@/actions/imageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, LoaderCircle, SquarePlus, TrashIcon } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const maxFileSize = 5; // 3MB

interface ImageDropzoneProps {
  image?: string | null;
  recipeId: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  image,
  recipeId,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(image!!);
  const [isLoading, setIsLoading] = useState(false);

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
    const { files } = e.dataTransfer;
    handleFile(files[0]);
  };

  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith(`image/`)) {
      setError(`Format d'imatge no vàlid`);
      return;
    }

    const fileSizeInKB = Math.round(file.size / 1024);
    if (maxFileSize && fileSizeInKB > maxFileSize * 1024) {
      setError(`La imatge ha d'ocupar menys de ${maxFileSize} MB`);
      return;
    }

    setError(null);
    setIsLoading(true);
    const checksum = await computeSHA256(file);
    const signedURL = await getSignedURL(
      file.type,
      file.size,
      checksum,
      recipeId
    );
    if ("error" in signedURL) {
      setError("Error pujant la Imatge");
      return;
    }
    try {
      await fetch(signedURL.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
    } catch {
      setError("Error pujant la imatge");
      return;
    }
    setImageSrc(signedURL.imageURL);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (imageSrc) {
      deleteImage(imageSrc);
      setImageSrc(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <Card className="w-full aspect-[4/3] flex items-center justify-center">
          <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
        </Card>
      ) : imageSrc ? (
        <Card className="w-full aspect-[4/3] relative">
          <Image
            src={imageSrc}
            alt="Imatge del plat"
            fill
            className="object-cover w-full h-full rounded-lg"
          />
          <Button
            className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/50"
            size="icon"
            variant="ghost"
            onClick={() => handleDelete()}
          >
            <TrashIcon className="text-white" />{" "}
          </Button>
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
                    <ImagePlus /> Adjunta una foto del plat
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
