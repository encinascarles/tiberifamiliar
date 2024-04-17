"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import Image from "next/image";

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton = ({ className }: GoogleAuthButtonProps) => {
  const handleClick = () => {
    signIn("google", { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };
  return (
    <Button
      variant="outline"
      className={cn("gap-4", className)}
      onClick={handleClick}
    >
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
