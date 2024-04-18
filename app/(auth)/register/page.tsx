import { GoogleAuthButton } from "../../../components/GoogleAuthButton";
import { RegisterForm } from "../../../components/RegisterForm";
import { TextDivider } from "../../../components/TextDivider";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <Link href="/login">
        <Button className="absolute top-12 right-12" variant="ghost">
          Login
        </Button>
      </Link>
      <div className="relative flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crea un compte
        </h1>
        <p className="text-sm text-muted-foreground">
          Entra el teu correu electrònic per continuar
        </p>
        <RegisterForm />
        <TextDivider>o continua amb</TextDivider>
        <GoogleAuthButton className="w-full" />
      </div>
    </>
  );
}
