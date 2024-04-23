import Link from "next/link";
import { Button } from "../ui/button";

const RegisterButton = () => {
  return (
    <Link href="/register">
      <Button className="h-9">Registra&apos;t</Button>
    </Link>
  );
};

export default RegisterButton;
