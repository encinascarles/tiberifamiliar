import { Suspense } from "react";
import GoBackToLoginButton from "../GoBackToLoginButton";
import { ResetPasswordForm } from "./ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
      <h1 className="text-2xl font-semibold tracking-tight">
        Reseteja la contrassenya
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        Entra el teu correu electrònic per continuar
      </p>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
      <GoBackToLoginButton />
    </div>
  );
};

export default ResetPasswordPage;
