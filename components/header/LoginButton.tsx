import Link from "next/link";
import { Button } from "../ui/button";

const LoginButton = () => {
  return (
    <Link href="/login">
      <Button className="h-9">Inicia sessió</Button>
    </Link>
  );
};

export default LoginButton;
