import { useEffect, useState, useMemo } from "react";
import VoiceNote from "./Voice";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import MessageStatus from "./Status";

const messageClasses = {
  base: "flex min-w-12 max-w-xs overflow-hidden items-center justify-center rounded-md py-2 text-[0.94rem] font-medium drop-shadow-sm",
  sender: "rounded-b-xl rounded-s-xl bg-zoyaprimary text-white",
  receiver: "rounded-b-xl rounded-r-xl bg-[#E8E8E8] text-black",
};

export default function MessageBubble({
  msg,
  userInfo,
  currentChatUser,
  type,
}) {
  const [audioBlob, setAudioBlob] = useState(null);
  const isSender = msg.senderId === userInfo?._id;

  useEffect(() => {
    if (msg.type === "audio") {
      setAudioBlob(msg?.message);
    }
  }, [msg]);

  const messageContent = useMemo(() => {
    switch (msg.type) {
      case "audio":
        return audioBlob ? (
          <VoiceNote
            audioBlob={audioBlob}
            loggedinUser={isSender}
            id={msg?._id}
          />
        ) : null;
      case "image":
        return (
          <Link
            target="_blank"
            to={msg?.message}
            className={`${messageClasses.base} flex flex-col border bg-white p-1`}
          >
            <img
              className="w-40 rounded-md object-contain"
              src={msg?.message}
              alt={`Image sent by ${isSender ? userInfo?.name : currentChatUser?.name}`}
              loading="lazy"
            />
            {msg?.caption ? (
              <span className="mt-1 text-xs font-semibold text-black/70">
                {msg?.caption}
              </span>
            ) : null}
          </Link>
        );
      default:
        return msg.message;
    }
  }, [msg, audioBlob, isSender, userInfo, currentChatUser]);

  return (
    <>
      <div
        className={`flex w-full flex-col gap-0.5 ${type === "admin" && "px-5"} ${isSender ? "items-end" : "items-start"}`}
      >
        {msg?.type !== "summary" && (
          <div className="flex text-[0.7rem] font-semibold text-black/40">
            {isSender ? userInfo?.name : currentChatUser?.name}
          </div>
        )}
        <div
          className={`${messageClasses.base} ${msg?.type === "summary" && "!bg-black/20 !text-black/70"} ${msg?.type !== "image" && "px-3"} ${msg?.type == "image" ? "" : isSender ? messageClasses.sender : messageClasses.receiver}`}
        >
          {messageContent}
        </div>
        {msg?.type !== "summary" && (
          <div
            className={`flex items-center gap-1 text-[0.7rem] font-semibold text-black/40 ${isSender ? "" : "flex-row-reverse"}`}
          >
            {msg?.receiverId === userInfo?._id ? null : (
              <MessageStatus status={msg?.messageStatus} />
            )}
            <span className={`${msg?.senderId === userInfo?._id && "-mt-1"}`}>
              {msg?.createdAt && dayjs(msg.createdAt).fromNow()}
            </span>
          </div>
        )}
      </div>
      {type === "admin" ? null : (
        <div className="flex items-start gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={isSender ? userInfo?.avatar : currentChatUser?.avatar}
              alt={isSender ? userInfo?.name : currentChatUser?.name}
            />
          </Avatar>
        </div>
      )}
    </>
  );
}
