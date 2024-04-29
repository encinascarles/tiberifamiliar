"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <Card className="my-auto mx-auto h-fit w-fit px-10 pt-10 pb-6">
      <CardTitle className="text-center">S{"'"}ha produit un error</CardTitle>
      <CardContent className="text-center max-w-[500px]">
        <p className="text-center text-sm mt-4">{error.message}</p>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col items-center gap-4">
        <Button onClick={() => reset()}>
          <RotateCcw className="mr-2" />
          Torna-ho a intentar
        </Button>
        <Button variant="secondary" onClick={() => handleBackClick()}>
          <ArrowLeft className="mr-2" size={20} />
          Torna enrere
        </Button>
      </CardFooter>
    </Card>
  );
}
