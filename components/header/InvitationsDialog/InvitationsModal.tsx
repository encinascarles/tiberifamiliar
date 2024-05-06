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
import { useCallback, useEffect, useState } from "react";
import InvitationCard from "./InvitationCard";

const InvitationsModal = () => {
  const { isOpen, close, open } = useInvitationsModal();
  const [invitations, setInvitations] = useState<Array<invitation>>([]);

  const getInvitations = useCallback(async () => {
    const invitationsResponse = await getUserInvitations();
    if ("error" in invitationsResponse) return;
    setInvitations(invitationsResponse);
    if (invitationsResponse.some((invitation) => !invitation.seen)) {
      // If some invite is not seen, open the dialog
      open();
    }
  }, [setInvitations, open]);

  useEffect(() => {
    // Call getInvitations when the dialog is opened
    if (isOpen) {
      getInvitations();
    }
  }, [isOpen, getInvitations]);

  useEffect(() => {
    getInvitations();
    // Configure an interval to call getInvitations every 60 seconds
    //const intervalId = setInterval(getInvitations, 60000); // 60000 ms = 1 minuto

    // Clean the interval when component is dismounted
    //return () => clearInterval(intervalId);
  }, [getInvitations]);

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
