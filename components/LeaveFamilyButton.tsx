"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useTransition } from "react";
import { leaveFamily } from "@/actions/families";
import { useRouter } from "next/navigation";

export function LeaveFamilyButton({ familyId }: { familyId: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(() => {
      leaveFamily(familyId).then((data) => {
        if (data?.success) {
          toast({
            variant: "success",
            description: data?.success,
          });
          router.push(`/families/`);
        } else {
          toast({
            variant: "destructive",
            description: data?.error,
          });
        }
      });
    });
  };

  return (
    <Button className="gap-2" onClick={() => handleClick()}>
      <LogOut className="w-5 h-5" />
      Surt
    </Button>
  );
}
