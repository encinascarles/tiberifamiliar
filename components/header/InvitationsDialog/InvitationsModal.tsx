"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserInvitations } from "@/actions/invitacions/getUserInvites";
import { useInvitationsModal } from "@/stores/useInvitationsModal";
import { invitation } from "@/types";
import { useEffect, useState } from "react";
import InvitationCard from "./InvitationCard";

const InvitationsModal = () => {
  const { isOpen, close, open } = useInvitationsModal();
  const [invitations, setInvitations] = useState<Array<invitation>>([]);

  const getInvitations = async () => {
    console.log("getInvitations");
    const invitationsResponse = await getUserInvitations();
    if ("error" in invitationsResponse) return;
    setInvitations(invitationsResponse);
    if (invitationsResponse.some((invitation) => !invitation.seen)) {
      // If some invite is not seen, open the dialog
      open();
    }
  };

  useEffect(() => {
    // Llama a getInvitations cada vez que se abre el diálogo
    if (isOpen) {
      getInvitations();
    }
  }, [isOpen]);

  useEffect(() => {
    getInvitations();
    // Configura un intervalo para llamar a getInvitations cada 60 segundos
    //const intervalId = setInterval(getInvitations, 60000); // 60000 ms = 1 minuto

    // Limpia el intervalo cuando el componente se desmonte
    //return () => clearInterval(intervalId);
  }, []);

  return (
    <Dialog onOpenChange={close} open={isOpen} modal defaultOpen={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitacions:</DialogTitle>
          <DialogDescription>
            {invitations && invitations.length === 0 ? (
              <p>No tens cap invitació</p>
            ) : (
              invitations &&
              invitations.map((invitation) => (
                <InvitationCard
                  key={invitation?.id}
                  {...invitation}
                  refresh={getInvitations}
                />
              ))
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationsModal;
