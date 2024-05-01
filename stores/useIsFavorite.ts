import { create } from "zustand";

type IsFavoriteState = {
  isFavorite: boolean;
  toggle: () => void;
  setIsFavorite: (value: boolean) => void;
};

export const useIsFavorite = create<IsFavoriteState>((set) => ({
  isFavorite: false,
  toggle: () => set((state) => ({ isFavorite: !state.isFavorite })),
  setIsFavorite: (value) => set({ isFavorite: value }),
}));
