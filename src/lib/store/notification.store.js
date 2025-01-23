import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],
  pauseNotification: false,
  addNotification: (newNotification) =>
    set((state) => {
      // Check for duplicates based on notification ID
      const isDuplicate = state.notifications.some(
        (notif) => notif._id === newNotification._id,
      );

      // If duplicate, return the current state
      if (isDuplicate) {
        return state;
      }

      // Add the new notification at the beginning of the array
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
      };
    }),
  enableNotification: (value) => set(() => ({ pauseNotification: value })),
  setNotifications: (newNotifications) =>
    set((state) => {
      const existingIds = new Set(
        state.notifications.map((notif) => notif?._id),
      );

      const uniqueNotifications = newNotifications.filter(
        (notif) => !existingIds.has(notif?._id),
      );
      return {
        ...state,
        notifications: [...uniqueNotifications, ...state.notifications],
      };
    }),

  // Mark a notification as read
  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications?.map((notif) =>
        notif?._id === notificationId ? { ...notif, status: "read" } : notif,
      ),
    })),

  markAllNotificationRead: () =>
    set((state) => ({
      notifications: state.notifications?.map((notif) => ({
        ...notif,
        status: "read",
      })),
    })),
}));
