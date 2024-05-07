import SearchBox from "@/components/header/SearchBox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container space-y-4">
      <h1>Benvingut a TiberiFamiliar</h1>
      <p>-Explicació de la web amb fotos-</p>
      <div>
        Nou a la app?
        <Link href="/register">
          <Button>Registra&quot;t</Button>
        </Link>
      </div>
      <div>
        Ja tens un compte?
        <Link href="/login">
          <Button>Inicia sessió</Button>
        </Link>
      </div>
      <div>
        Explora receptes
        <SearchBox />
      </div>
    </div>
  );
}
