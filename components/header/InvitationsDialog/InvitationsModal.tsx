"use client";
import { getUserInvitations } from "@/actions/invitations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useInvitationsModal } from "@/stores/useInvitationsModal";
import { useEffect, useState } from "react";
import InvitationCard from "./InvitationCard";

interface Invitation {
  id: string;
  inviterId: string;
  inviterName: string;
  familyName: string;
  familyImage: string | null;
}

const InvitationsModal = () => {
  const { isOpen, close } = useInvitationsModal();
  const [invitations, setInvitations] = useState<Array<Invitation>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getInvitations = async () => {
    const invitations = await getUserInvitations();
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
