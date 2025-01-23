import { MessageSquareText, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentChatUser } from "@/lib/store/chat.store";
import { useMakeCall } from "@/lib/store/socket.store";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export function ContactItem({ user, startChat, userInfo }) {
  const currentChatUser = useCurrentChatUser();
  const makeCall = useMakeCall();
  const [ongoingCall, setOngoingCall] = useState(() => {
    const savedCall = localStorage.getItem("ongoingCall");
    return savedCall ? JSON.parse(savedCall) : null;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "ongoingCall") {
        setOngoingCall(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleMakeCall = () => {
    if (ongoingCall) {
      toast.error(
        "You are already in a call. Please end the current call before starting a new one.",
      );
      return;
    }
    makeCall({
      currentChatUser: {
        _id: user?._id,
        name: user?.name,
        avatar: user?.avatar,
        chat_id: user?.chat?._id,
      },
      userInfo,
    });
  };

  return (
    <div
      className={`flex h-14 min-h-14 cursor-pointer items-center justify-between px-4 text-sm ${currentChatUser?._id == user?._id ? "bg-[#E8E8E8]" : ""}`}
    >
      <div className="flex items-center gap-3">
        <span className="line-clamp-1 font-semibold capitalize">
          {user.name}
        </span>
      </div>
      <div className="flex items-center">
        {user.chat?._id && user.chat?.status === "active" && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => startChat(user)}
              aria-label={`Start chat with ${user.name}`}
            >
              <MessageSquareText className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMakeCall}
              aria-label={`Call ${user.name}`}
            >
              <PhoneIcon className="size-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
