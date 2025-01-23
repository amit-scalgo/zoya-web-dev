import { create } from "zustand";

export const useUserStore = create((set) => ({
  userInfo: undefined,
  onlineUsers: [],
  setUserInfo: (userInfo) => set({ userInfo }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
}));
