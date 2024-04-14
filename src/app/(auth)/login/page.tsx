import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Inicia sessió</h1>
      <p className="text-sm text-muted-foreground">
        Entra eles teves credencials per continuar
      </p>
      <Input placeholder="Correu Electrònic"></Input>
      <Input type="password" placeholder="Contrassenya"></Input>
      <Button className="w-full">Inicia Sessió amb correu electrònic</Button>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase my-4">
          <span className="bg-background px-2 text-muted-foreground">
            o continua amb
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full gap-2">
        <Image
          className="w-6 h-6"
          width="24"
          height="24"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        Google
      </Button>
    </>
  );
}
