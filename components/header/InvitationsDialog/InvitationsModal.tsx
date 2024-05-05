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
  const { isOpen, close } = useInvitationsModal();
  const [invitations, setInvitations] = useState<Array<invitation>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getInvitations = async () => {
    const invitations = await getUserInvitations();
    if ("error" in invitations) return;
    setInvitations(invitations);
    setIsLoading(false);
  };

  useEffect(() => {
    getInvitations();
  }, []);

  return (
    <Dialog onOpenChange={close} open={isOpen} modal defaultOpen={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitacions:</DialogTitle>
          <DialogDescription>
            {isLoading ? (
              <p>Loading...</p>
            ) : invitations && invitations.length === 0 ? (
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
