import { create } from "zustand";
import { newFormRequest, newRequest } from "@/endpoints";
import { SEND_MESSAGE, SEND_VOICE_MESSAGE } from "@/endpoints/chat";
import { useUserStore } from "./user.store.js";
import { useSocketStore } from "./socket.store.js";
import { useChatStore } from "./chat.store.js";
import { scrollToBottom } from "../utils.js";

const createMessageSlice = (set, get) => ({
  inputMessage: "",
  isMessageSending: false,
  setInputMessage: (message) => {
    if (get().inputMessage !== message) {
      set({ inputMessage: message });
    }
  },

  sendMessage: async () => {
    const { inputMessage, setInputMessage } = get();
    const { userInfo } = useUserStore.getState();
    const { socket } = useSocketStore.getState();
    const { currentChatUser, addMessage } = useChatStore.getState();

    if (!inputMessage.trim() || !currentChatUser) return;

    const newMessage = {
      message: inputMessage.trim(),
      from: userInfo?._id,
      to: currentChatUser?._id,
      chatId: currentChatUser?.chat_id,
      type: "text",
    };
    set({
      isMessageSending: true,
    });
    try {
      const response = await newRequest.post(SEND_MESSAGE, newMessage);
      addMessage(response.data.message, true);
      const latestMessage = {
        message: inputMessage.trim(),
        from: response.data.message?.senderId,
        to: response.data.message?.receiverId,
        chatId: currentChatUser?.chat_id,
        messageId: response?.data?.message?._id,
        type: "text",
      };
      set({
        isMessageSending: false,
      });
      socket.emit("send-msg", latestMessage);
      setInputMessage("");
      scrollToBottom();
    } catch (error) {
      set({
        isMessageSending: false,
      });
      console.error("Error sending message:", error);
    }
  },

  sendAudioMessage: async (audioBlob) => {
    const { socket } = useSocketStore.getState();
    const { userInfo } = useUserStore.getState();
    const { currentChatUser, addMessage } = useChatStore.getState();
    if (!audioBlob || !currentChatUser) return;
    set({
      isMessageSending: true,
    });
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("type", "audio");
    formData.append("from", userInfo?._id);
    formData.append("to", currentChatUser?._id);
    formData.append("chatId", currentChatUser?.chat_id);

    try {
      const response = await newFormRequest.post(SEND_VOICE_MESSAGE, formData);
      addMessage(response.data.message, true);
      socket.emit("send-msg", {
        to: currentChatUser?._id,
        from: userInfo?._id,
        chatId: currentChatUser?.chat_id,
        messageId: response?.data?.message?._id,
        message: response.data.message?.message,
        type: "audio",
      });
      set({
        isMessageSending: false,
      });
      scrollToBottom();
    } catch (error) {
      set({
        isMessageSending: false,
      });
      console.error("Error sending audio message:", error);
    }
  },
});

// Create the store
export const useMessageStore = create((set, get) => ({
  ...createMessageSlice(set, get),
}));

// Create selector hooks
export const useInputMessage = () =>
  useMessageStore((state) => state.inputMessage);

export const useIsMessageSending = () =>
  useMessageStore((state) => state.isMessageSending);
export const useSetInputMessage = () =>
  useMessageStore((state) => state.setInputMessage);
export const useSendMessage = () =>
  useMessageStore((state) => state.sendMessage);
export const useSendAudioMessage = () =>
  useMessageStore((state) => state.sendAudioMessage);
