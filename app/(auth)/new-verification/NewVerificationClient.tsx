"use client";

import { newVerification } from "@/actions/authentication";
import { FormError } from "@/components/formMessages/FormError";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const NewVerificationClient = () => {
  // Get the token from the URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // State for displaying error messages
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  // Router for navigation
  const router = useRouter();

  // Token submission handler
  const onSubmit = useCallback(() => {
    // Check if the token is missing
    if (!token) {
      setError("Falta el token!");
      return;
    }

    // Verify the user with the token
    newVerification(token).then((response) => {
      if ("error" in response) {
        setError(response.error);
        return;
      }
      // Show success message and redirect to login
      toast({
        title: "Correu verificat",
        description: response.success,
        variant: "success",
      });
      router.push("/login");
    });
  }, [token, router, toast]);

  // Call the submission handler on mount
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex flex-col items-center gap-6">
      {error ? (
        <>
          <FormError message={error} />
          <Button asChild>
            <Link href="/login">Torna a la pàgina d{"'"}inici de sessió</Link>
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-lg text-slate-600">
            Verificant el correu electrònic
          </h1>
          <BeatLoader color="#EA580C" size={15} />
        </>
      )}
    </div>
  );
};

export default NewVerificationClient;
