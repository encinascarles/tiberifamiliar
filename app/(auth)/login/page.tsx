import Link from "next/link";
import { TextDivider } from "../../../components/TextDivider";
import { GoogleAuthButton } from "../GoogleAuthButton";
import { LoginForm } from "./LoginForm";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <>
      {/* <Link href="/register">
        <Button className="absolute top-12 right-12" variant="ghost">
          Registra&apos;t
        </Button>
      </Link> */}
      <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
        <h1 className="text-2xl font-semibold tracking-tight">Inicia sessió</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Entra les teves credencials per continuar
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
        <TextDivider>o continua amb</TextDivider>
        <Suspense>
          <GoogleAuthButton className="w-full" />
        </Suspense>
        <p className="text-sm text-muted-foreground mt-2">
          Encara no tens un compte?{" "}
          <Button
            size="sm"
            variant="link"
            asChild
            className="px-0 font-normal"
            type="button"
          >
            <Link href="/register">Registra&apos;t</Link>
          </Button>
        </p>
      </div>
    </>
  );
}
