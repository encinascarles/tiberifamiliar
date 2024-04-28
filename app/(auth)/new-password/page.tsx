import { Suspense } from "react";
import GoBackToLoginButton from "../GoBackToLoginButton";
import { NewPasswordForm } from "./NewPasswordForm";

const NewPasswordPage = () => {
  return (
    <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
      <h1 className="text-2xl font-semibold tracking-tight">
        Nova contrassenya
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        Entra la nova contrassenya per continuar
      </p>
      <Suspense>
        <NewPasswordForm />
      </Suspense>
      <GoBackToLoginButton />
    </div>
  );
};

export default NewPasswordPage;
