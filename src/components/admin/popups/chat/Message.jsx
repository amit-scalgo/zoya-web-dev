import MessageBubble from "@/components/app/chat/message/Bubble";
import React, { useRef } from "react";

export default function MessagesView({ messages, participants }) {
  const messageContainerRef = useRef(null);

  const currentUser = participants?.find(
    (participant) => participant?.role === "user",
  );

  const getParticipantInfo = (participantId) => {
    return participants?.find(
      (participant) => participant?._id === participantId,
    );
  };

  return (
    <div
      ref={messageContainerRef}
      className="overflow-y-min flex h-[27rem] w-full flex-1 flex-col overflow-y-auto overflow-x-hidden rounded bg-zoyaprimary/5 py-4"
    >
      {messages?.map((msg) => {
        const sender = getParticipantInfo(msg?.senderId);
        if (!sender) return null;
        return (
          <div
            key={msg?._id}
            className={`mb-3 flex w-full items-start gap-2 ${
              msg?.from === currentUser?._id
                ? "self-end"
                : "flex-row-reverse self-start"
            }`}
          >
            <MessageBubble
              msg={msg}
              userInfo={currentUser}
              currentChatUser={sender}
              type="admin"
            />
          </div>
        );
      })}
    </div>
  );
}
