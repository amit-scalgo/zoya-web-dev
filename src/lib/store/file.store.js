import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { useChatStore } from "./chat.store";
import { useUserStore } from "./user.store";
import { useSocketStore } from "./socket.store";
import { useMessageStore } from "./message.store";
import { newFormRequest } from "@/endpoints";
import { scrollToBottom } from "../utils";

export const useMessageFileStore = create((set, get) => ({
  file: null,
  isFileSending: false,
  setFile: (file) => set({ file: file }),
  sendFileMessage: async (inputMessage) => {
    // will do optimistic update
    const { file } = get();
    const { socket } = useSocketStore.getState();
    const { userInfo } = useUserStore.getState();
    const { currentChatUser, addMessage } = useChatStore.getState();
    const { setInputMessage } = useMessageStore.getState();
    if (!file || !currentChatUser) return;

    set({ isFileSending: true });
    const formData = new FormData();
    formData.append("image", file);
    formData.append("from", userInfo?._id);
    formData.append("to", currentChatUser?._id);
    formData.append("chatId", currentChatUser?.chat_id);
    formData.append("caption", inputMessage);
    try {
      const response = await newFormRequest.post(
        "/chat/add-image-message",
        formData,
      );
      addMessage(response.data.message, true);
      setInputMessage("");
      set({ isFileSending: false });
      set({ file: null });
      socket.emit("send-msg", {
        to: currentChatUser?._id,
        from: userInfo?._id,
        message: response.data.message?.message,
        caption: response.data.message?.caption,
        type: "image",
        chatId: currentChatUser?.chat_id,
        messageId: response?.data?.message?._id,
      });
      scrollToBottom();
    } catch (error) {
      console.error("Error sending audio message:", error);
    }
  },
}));

export const useSendFileMessage = () =>
  useMessageFileStore((state) => state.sendFileMessage);
