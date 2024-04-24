"use client";
import { useInvitationsModal } from "@/stores/useInvitationsModal";
import { Bell } from "lucide-react";

const InvitationsButton = () => {
  const { open } = useInvitationsModal();

  return (
    <button onClick={open} className="flex items-center">
      <Bell className="mr-2 h-4 w-4" />
      <span>Invitacions</span>
    </button>
  );
};

export default InvitationsButton;
