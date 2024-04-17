import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { RegisterForm } from "@/components/RegisterForm";
import { TextDivider } from "@/components/TextDivider";

export default function RegisterPage() {
  return (
    <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
      <h1 className="text-2xl font-semibold tracking-tight">Crea un compte</h1>
      <p className="text-sm text-muted-foreground">
        Entra el teu correu electrònic per continuar
      </p>
      <RegisterForm />
      <TextDivider>o continua amb</TextDivider>
      <GoogleAuthButton className="w-full" />
    </div>
  );
}
