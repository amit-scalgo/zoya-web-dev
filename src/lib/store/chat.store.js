import { create } from "zustand";
import { MARK_ALL_MESSAGES_READ } from "@/endpoints/chat";
import { newRequest } from "@/endpoints";
import { queryClient } from "../queryclient";
import { useSocketStore } from "./socket.store";
import { useUserStore } from "./user.store";
import { produce } from "immer";
import { useMessageStore } from "./message.store";
import { useRefetchUserChats } from "@/hooks/useUserChats";

const initialState = {
  currentChatUser: undefined,
  chatList: [],
  refetchUserChats: null,
  messages: [],
  chatTab: 0,
  chatListView: true,
  chatUserDetailView: false,
};

const createChatSlice = (set, get) => ({
  ...initialState,
  setRefetchUserChats: (refetch) => set(() => ({ refetchUserChats: refetch })),
  setChatTab: (tab) => {
    const refetchUserChats = get().refetchUserChats;
    set({ chatTab: tab });
    if (tab === 1) {
      refetchUserChats();
    }
  },
  setChatListView: (state) => set({ chatListView: state }),
  setChatUserDetailView: (state) => set({ chatUserDetailView: state }),
  setMessages: (messages) => {
    const { currentChatUser } = get();
    // If there's no active chat or no new messages, just reset the state
    if (!currentChatUser || messages.length === 0) {
      set({ messages });
      return;
    }
    set(
      produce((state) => {
        // Filter out messages that do not belong to the current chat
        const currentChatMessages = messages.filter(
          (message) =>
            message.senderId === currentChatUser._id ||
            message.receiverId === currentChatUser._id,
        );
        // Merge the new messages with the existing ones
        const mergedMessages = [
          ...state.messages.filter(
            (msg) =>
              !currentChatMessages.find((newMsg) => newMsg._id === msg._id),
          ), // Retain existing messages not in the new batch
          ...currentChatMessages, // Add or update with new messages
        ];
        // Sort merged messages by `createdAt` to ensure chronological order
        mergedMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        // Update the state with the merged messages and set status for current chat messages
        state.messages = mergedMessages.map((message) =>
          message.senderId === currentChatUser._id
            ? { ...message, messageStatus: "read" }
            : message,
        );
      }),
    );
  },

  changeCurrentChatUser: (user) => {
    const setInputMessage = useMessageStore.getState().setInputMessage;
    const socket = useSocketStore.getState().socket;
    const userInfo = useUserStore.getState().userInfo;

    if (user?._id !== get().currentChatUser?._id) {
      newRequest
        .post(MARK_ALL_MESSAGES_READ, { chatId: user?.chat_id })
        .then(() => queryClient.invalidateQueries(["userMessages"]))
        .catch((error) =>
          console.error("Error marking messages as read:", error),
        );
    }

    set(
      produce((state) => {
        setInputMessage("");
        state.currentChatUser = user;
        state.messages = [];
        if (!user) return;

        socket.emit("mark-read", {
          senderId: userInfo?._id,
          receiverId: user?._id,
          chatId: state.currentChatUser?.chat_id,
        });

        state.chatList = state.chatList.map((contact) =>
          contact._id === user._id
            ? { ...contact, totalUnreadMessages: 0 }
            : contact,
        );
      }),
    );
  },

  addMessage: (newMessage, fromSelf) => {
    const { userInfo } = useUserStore.getState();
    const { socket } = useSocketStore.getState();
    set(
      produce((state) => {
        // Find the chat in the list, checking both senderId and receiverId
        const chatIndex = state.chatList.findIndex(
          (contact) =>
            contact?._id === newMessage?.senderId ||
            contact?._id === newMessage?.receiverId,
        );
        if (chatIndex !== -1) {
          const updatedChat = { ...state.chatList[chatIndex] };
          Object.assign(updatedChat, {
            lastMessage: { text: newMessage.message },
            type: newMessage.type,
            messageId: newMessage._id,
            messageStatus: newMessage.messageStatus,
            receiverId: newMessage.receiverId,
            senderId: newMessage.senderId,
            totalUnreadMessages:
              fromSelf || updatedChat?._id === state.currentChatUser?._id
                ? 0
                : (updatedChat.totalUnreadMessages || 0) + 1,
          });
          state.chatList.splice(chatIndex, 1);
          state.chatList.unshift(updatedChat);
        }
        const latestMessage = {
          ...newMessage,
          messageStatus:
            userInfo?._id === newMessage?.receiverId &&
            state.currentChatUser?.chat_id === newMessage?.chatId
              ? "read"
              : newMessage.messageStatus,
        };
        if (
          fromSelf ||
          state.currentChatUser?._id === newMessage.receiverId ||
          state.currentChatUser?._id === newMessage.senderId
        ) {
          if (!fromSelf) {
            socket.emit("mark-read", {
              receiverId: newMessage.senderId,
              senderId: newMessage.receiverId,
              chatId: state.currentChatUser?.chat_id,
            });
          }
          state.messages.push(latestMessage);
        }
      }),
    );
  },

  setChatList: (chatList) => set({ chatList }),

  exitChat: () => set({ currentChatUser: undefined, messages: [] }),

  markMessagesRead: (senderId, receiverId) => {
    const { userInfo } = useUserStore.getState();
    set(
      produce((state) => {
        if (
          userInfo._id !== receiverId ||
          state.currentChatUser?._id !== senderId
        )
          return;
        state.messages = state.messages.map((msg) =>
          msg.senderId === userInfo?._id
            ? { ...msg, messageStatus: "read" }
            : msg,
        );
        state.chatList = state.chatList.map((contact) => {
          if (contact?._id === senderId && userInfo._id === receiverId) {
            return {
              ...contact,
              totalUnreadMessages:
                state.currentChatUser?._id === senderId
                  ? 0
                  : contact?.totalUnreadMessages,
            };
          }
          return contact;
        });
      }),
    );
  },
});

export const useChatStore = create(createChatSlice);

// Selector hooks
export const useCurrentChatUser = () =>
  useChatStore((state) => state.currentChatUser);
export const useSetRefetchUserChats = () =>
  useChatStore((state) => state.setRefetchUserChats);
export const useChatList = () => useChatStore((state) => state.chatList);
export const useMessages = () => useChatStore((state) => state.messages);
export const useChatTab = () => useChatStore((state) => state.chatTab);
export const useChatListView = () =>
  useChatStore((state) => state.chatListView);
export const useChatUserDetailView = () =>
  useChatStore((state) => state.chatUserDetailView);

// Action hooks
export const useSetChatTab = () => useChatStore((state) => state.setChatTab);
export const useSetChatListView = () =>
  useChatStore((state) => state.setChatListView);
export const useSetChatUserDetailView = () =>
  useChatStore((state) => state.setChatUserDetailView);
export const useSetMessages = () => useChatStore((state) => state.setMessages);
export const useChangeCurrentChatUser = () =>
  useChatStore((state) => state.changeCurrentChatUser);
export const useAddMessage = () => useChatStore((state) => state.addMessage);
export const useSetChatList = () => useChatStore((state) => state.setChatList);
export const useExitChat = () => useChatStore((state) => state.exitChat);
export const useMarkMessagesRead = () =>
  useChatStore((state) => state.markMessagesRead);
