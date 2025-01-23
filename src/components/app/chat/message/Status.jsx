import { useCurrentChatUser } from "@/lib/store/chat.store";
import { useUserStore } from "@/lib/store/user.store";
import { Check, CheckCheck } from "lucide-react";

export default function MessageStatus({ status }) {
  const currentChatUser = useCurrentChatUser();
  const { onlineUsers } = useUserStore();
  const isOnline = onlineUsers?.includes(currentChatUser?._id);

  return (
    <>
      {status === "sent" && !isOnline ? (
        <Check className="size-4" aria-label={`Message ${status}`} />
      ) : (
        <CheckCheck
          className={`size-4 ${status === "read" ? "text-green-500" : ""}`}
          aria-label={`Message ${status}`}
        />
      )}
    </>
  );
}
