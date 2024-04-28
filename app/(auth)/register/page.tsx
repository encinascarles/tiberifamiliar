import Link from "next/link";
import { TextDivider } from "../../../components/TextDivider";
import { Button } from "../../../components/ui/button";
import { GoogleAuthButton } from "../GoogleAuthButton";
import { RegisterForm } from "./RegisterForm";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <>
      {/* <Link href="/login">
        <Button className="absolute top-12 right-12" variant="ghost">
          Login
        </Button>
      </Link> */}
      <div className="relative flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crea un compte
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          Entra el teu correu electrònic per continuar
        </p>
        <Suspense>
          <RegisterForm />
        </Suspense>
        <TextDivider>o continua amb</TextDivider>
        <Suspense>
          <GoogleAuthButton className="w-full" />
        </Suspense>
        <p className="text-sm text-muted-foreground mt-2">
          Ja tens un compte?{" "}
          <Button
            size="sm"
            variant="link"
            asChild
            className="px-0 font-normal"
            type="button"
          >
            <Link href="/login">Inicia sessió</Link>
          </Button>
        </p>
      </div>
    </>
  );
}
