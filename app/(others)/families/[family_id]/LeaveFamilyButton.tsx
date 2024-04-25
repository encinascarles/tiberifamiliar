"use client";

import { LogOut } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../../components/ui/use-toast";
import { useTransition } from "react";
import { leaveFamily } from "@/actions/families";
import { useRouter } from "next/navigation";

export function LeaveFamilyButton({ familyId }: { familyId: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(() => {
      leaveFamily(familyId).then((response) => {
        if ("error" in response) {
          toast({
            variant: "destructive",
            description: response.error,
          });
          return;
        }
        toast({
          variant: "success",
          description: response.success,
        });
        router.push(`/families/`);
      });
    });
  };

  return (
    <Button
      className="gap-2"
      onClick={() => handleClick()}
      disabled={isPending}
    >
      <LogOut className="w-5 h-5" />
      Surt
    </Button>
  );
}
