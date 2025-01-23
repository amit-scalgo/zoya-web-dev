import { memo } from "react";
import MessageBubble from "./Bubble";
import { useUserStore } from "@/lib/store/user.store";
import { useCurrentChatUser, useMessages } from "@/lib/store/chat.store";

const MessageContainer = memo(function MessageContainer() {
  const currentChatUser = useCurrentChatUser();
  const messages = useMessages();
  const { userInfo } = useUserStore();

  return (
    <div className="flex w-full flex-col">
      {messages?.map((msg, index) => (
        <div
          key={`${msg.senderId}-${index}`}
          className={`mb-3 flex items-start gap-2 ${
            msg.senderId === userInfo._id
              ? "self-end"
              : "flex-row-reverse self-start"
          }`}
        >
          <MessageBubble
            msg={msg}
            userInfo={userInfo}
            currentChatUser={currentChatUser}
            type="user"
          />
        </div>
      ))}
    </div>
  );
});

export default MessageContainer;
