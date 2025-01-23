import { useEffect, useCallback, useMemo } from "react";
import { useSocket } from "@/lib/store/socket.store";
import {
  useAddMessage,
  useChatListView,
  useChatTab,
  useCurrentChatUser,
  useMarkMessagesRead,
} from "@/lib/store/chat.store";
import Chatbox from "./ChatBox";
import ChatSidebar from "./ChatSidebar";
import ChatSummary from "@/components/popups/chat/ChatSummary";
import { ChatSuggestion } from "@/components/popups/chat/sugesstion/ChatSuggestion";

export default function ChatContainer() {
  const socket = useSocket();
  const chatListView = useChatListView();
  const markMessagesRead = useMarkMessagesRead();
  const addMessage = useAddMessage();
  const currentChatUser = useCurrentChatUser();
  const chatTab = useChatTab();

  const handleMsgReceive = useCallback(
    (newMessage) => {
      if (newMessage && newMessage.message) {
        addMessage(
          {
            receiverId: newMessage.to,
            senderId: newMessage.from,
            message: newMessage.message,
            type: newMessage.type ?? "text",
            createdAt: newMessage.createdAt,
            messageStatus: newMessage.messageStatus,
            chatId: newMessage.chatId,
            _id: newMessage?._id,
          },
          false,
        );
        // Move this part to a separate useEffect
        const scrollableDiv = document.getElementById("scrollableDiv");
        if (scrollableDiv) {
          setTimeout(() => {
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
          }, 0);
        } else {
          console.error("Scrollable div is not set or does not exist.");
        }
      }
    },
    [addMessage],
  );

  const handleReadReceive = useCallback(
    ({ senderId, receiverId }) => {
      setTimeout(() => {
        markMessagesRead(senderId, receiverId);
      }, 50);
    },
    [markMessagesRead],
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("msg-recieve", handleMsgReceive);
    socket.on("mark-read-receive", handleReadReceive);

    return () => {
      socket.off("msg-recieve", handleMsgReceive);
      socket.off("mark-read-receive", handleReadReceive);
    };
  }, [socket, handleMsgReceive, handleReadReceive]);

  // for scrolling
  useEffect(() => {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }, [currentChatUser]);

  const chatContent = useMemo(() => {
    return currentChatUser && chatTab === 1 ? (
      <>
        <ChatSuggestion />
        <ChatSummary />
        <Chatbox />
      </>
    ) : (
      <div className="m-auto flex flex-col items-center justify-center">
        <img
          className="h-52 object-contain"
          src="/chat/no-chat.svg"
          alt="No chat selected"
        />
      </div>
    );
  }, [currentChatUser, chatTab]);

  return (
    <div className="flex h-full w-full">
      {chatListView && <ChatSidebar />}
      <div className="flex w-full flex-grow">{chatContent}</div>
    </div>
  );
}
