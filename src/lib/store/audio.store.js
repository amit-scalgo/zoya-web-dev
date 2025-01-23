import { create } from "zustand";

export const useAudioPlayerStore = create((set) => ({
  currentlyPlayingId: null,
  setCurrentlyPlayingId: (id) => set({ currentlyPlayingId: id }),
}));
