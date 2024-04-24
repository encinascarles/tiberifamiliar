"use client";
import { getUserInvitations } from "@/actions/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useInvitationsModal } from "@/stores/useInvitationsModal";
import { useEffect, useState } from "react";

interface Invitation {
  id: string;
  inviterId: string;
  inviterName: string;
  familyName: string;
  familyImage: string | null;
}

const InvitationsModal = () => {
  const { isOpen, close } = useInvitationsModal();
  const [invitations, setInvitations] = useState<Array<Invitation | undefined>>(
    []
  );

  const getInvitations = async () => {
    const invitations = await getUserInvitations();
    setInvitations(invitations);
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
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationsModal;
