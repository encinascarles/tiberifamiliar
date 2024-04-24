import { create } from "zustand";

type InvitationsModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useInvitationsModal = create<InvitationsModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
