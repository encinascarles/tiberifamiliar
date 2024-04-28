"use client";

import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/authentication";
import { FormError } from "@/components/formMessages/FormError";
import { FormSuccess } from "@/components/formMessages/FormSuccess";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Falta el token!");
      return;
    }
    newVerification(token)
      .then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        setSuccess(response.success);
      })
      .catch(() => {
        setError("Error en la verificació");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-lg text-slate-600">
        Verificant el correu electrònic
      </h1>
      {!success && !error && <BeatLoader />}
      <FormSuccess message={success} />
      <FormError message={error} />
    </div>
  );
};

export default NewVerificationForm;
