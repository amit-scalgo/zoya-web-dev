import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/store/user.store";

export default function ChatListCard({
  user,
  currentChatUser,
  handleSelectUser,
}) {
  const { onlineUsers } = useUserStore();
  const isCurrentUser = currentChatUser?._id === user?._id;
  const lastMessageText = user?.lastMessage?.text || "No messages yet";

  const getLastMessagePreview = () => {
    if (lastMessageText.includes("recordings")) return "Voice Message";
    if (lastMessageText.includes("cloudinary")) return "Image";
    return lastMessageText;
  };

  // const handleTypingReceive = (typingData) => {
  //   const { chatId, typing } = typingData;
  //   if (currentChatUser?.chat_id == chatId) {
  //     isTyping(typing);
  //   }
  // };

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("typing-receive", handleTypingReceive);

  //   return () => {
  //     socket.off("typing-receive", handleTypingReceive);
  //   };
  // }, [currentChatUser, socket, handleTypingReceive]);

  return (
    <div
      onClick={() => handleSelectUser(user)}
      role="button"
      tabIndex={0}
      className={`relative flex h-14 cursor-pointer items-center gap-3 px-3 ${isCurrentUser && "bg-black/5"}`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback
          className={`text-xs font-semibold ${isCurrentUser && "bg-zoyaprimary text-white"}`}
        >
          {user?.name?.charAt(0).toUpperCase()}
          {user?.name?.charAt(1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="line-clamp-1 font-semibold capitalize">
            {user?.name}
          </span>
          {user?.chatStatus === "active" && (
            <>
              {onlineUsers?.includes(user?._id) && (
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              )}
            </>
          )}
        </div>
        <span className="line-clamp-1 text-xs font-medium">
          {getLastMessagePreview()}
        </span>
      </div>
      {user?.totalUnreadMessages > 0 ? (
        <div
          className="absolute right-3 flex size-4 items-center justify-center rounded-full bg-zoyaprimary text-[0.61rem] font-bold text-white"
          aria-label={`${user?.name} has ${user.totalUnreadMessages} unread messages`}
        >
          {user.totalUnreadMessages}
        </div>
      ) : null}
    </div>
  );
}
