import { GoogleAuthButton } from "../../../components/GoogleAuthButton";
import { LoginForm } from "../../../components/LoginForm";
import { TextDivider } from "../../../components/TextDivider";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <Link href="/register">
        <Button className="absolute top-12 right-12" variant="ghost">
          Registra&apos;t
        </Button>
      </Link>
      <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
        <h1 className="text-2xl font-semibold tracking-tight">Inicia sessió</h1>
        <p className="text-sm text-muted-foreground">
          Entra les teves credencials per continuar
        </p>
        <LoginForm />
        <TextDivider>o continua amb</TextDivider>
        <GoogleAuthButton className="w-full" />
      </div>
    </>
  );
}
