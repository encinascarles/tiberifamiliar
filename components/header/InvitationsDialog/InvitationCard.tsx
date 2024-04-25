"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { acceptInvitation, rejectInvitation } from "@/actions/invitations";
import { invitation } from "@/types";

interface InvitationCardProps extends invitation {
  refresh: () => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  id,
  inviterId,
  inviterName,
  familyName,
  familyImage,
  refresh,
}) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccept = () => {
    startTransition(() => {
      acceptInvitation(id).then((response) => {
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
        refresh();
        //router.push(`/families/`);
      });
    });
  };

  const handleReject = () => {
    startTransition(() => {
      rejectInvitation(id).then((response) => {
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
        refresh();
        //router.push(`/families/`);
      });
    });
  };

  return (
    <Card className="flex justify-stretch">
      <Image
        src={familyImage ? familyImage : "/demo_images/family.png"}
        alt="family image"
        height="110"
        width="130"
        className="h-[110px] w-[130px] object-cover rounded-l-lg"
      />
      <div className="p-2 flex flex-col gap-2 justify-between">
        <p className="">
          <Link
            href={`/perfil/${inviterId}`}
            className="font-semibold hover:text-orange-600"
          >
            {inviterName}{" "}
          </Link>
          t&apos;ha convidat a unir-te a la família{" "}
          <b className="font-semibold">{familyName}</b>
        </p>
        <div className="flex justify-center gap-2">
          <Button disabled={isPending} onClick={() => handleAccept()}>
            Accepta
          </Button>
          <Button disabled={isPending} onClick={() => handleReject()}>
            Rebutja
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InvitationCard;
