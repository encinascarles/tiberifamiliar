import { Button } from "@/components/ui/button";
import Link from "next/link";

const GoBackToLoginButton = () => {
  return (
    <Button
      size="sm"
      variant="link"
      asChild
      className="px-0 font-normal"
      type="button"
    >
      <Link href="/login">Torna a la pàgina d{"'"}inici de sessió</Link>
    </Button>
  );
};

export default GoBackToLoginButton;
