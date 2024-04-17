import { Button } from "@/components/ui/button";
import Image from "next/image";

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton = ({ className }: GoogleAuthButtonProps) => {
  return (
    <Button variant="outline" className={className}>
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
  );
};
