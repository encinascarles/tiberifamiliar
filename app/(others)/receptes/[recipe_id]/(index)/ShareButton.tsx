"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Share2 } from "lucide-react";

const ShareButton = () => {
  const { toast } = useToast();
  const handleClick = () => {
    navigator.clipboard.writeText(
      `Et convido a veure aquesta recepta de TiberiFamiliar: ${window.location.href}`
    );
    toast({
      variant: "success",
      description: "Copiat al porta-retalls!",
    });
  };
  return (
    <Button
      variant="secondary"
      className="gap-2 flex-grow"
      onClick={handleClick}
    >
      <Share2 size={20} />
      Compartir
    </Button>
  );
};

export default ShareButton;
