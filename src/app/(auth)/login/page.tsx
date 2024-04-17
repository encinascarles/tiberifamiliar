import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { LoginForm } from "@/components/LoginForm";
import { TextDivider } from "@/components/TextDivider";

export default function LoginPage() {
  return (
    <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
      <h1 className="text-2xl font-semibold tracking-tight">Inicia sessió</h1>
      <p className="text-sm text-muted-foreground">
        Entra eles teves credencials per continuar
      </p>
      <LoginForm />
      <TextDivider>o continua amb</TextDivider>
      <GoogleAuthButton className="w-full gap-4" />
    </div>
  );
}
