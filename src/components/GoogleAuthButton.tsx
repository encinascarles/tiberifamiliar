import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton = ({ className }: GoogleAuthButtonProps) => {
  return (
    <Button variant="outline" className={cn("gap-4", className)}>
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
