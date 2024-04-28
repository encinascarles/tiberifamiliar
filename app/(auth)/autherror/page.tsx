import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthErrorPage = () => {
  return (
    <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
      <h1 className="text-2xl font-semibold tracking-tight">
        Error amb l{"'"}autenticació
      </h1>
      <p className="text-sm text-muted-foreground">Torna-ho a intentar</p>
      <div className="space-x-4 mt-8">
        <Link href="/login">
          <Button>Inicia sessió</Button>
        </Link>
        <Link href="/register">
          <Button>Registra{"'"}t</Button>
        </Link>
      </div>
    </div>
  );
};
export default AuthErrorPage;
