"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
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
      <CardTitle>S{"'"}ha produit un error</CardTitle>
      <CardFooter className="mt-8 flex flex-col items-center gap-4">
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
