import { useState, useEffect, useRef, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import { Loader2, SmilePlus, Trash2 } from "lucide-react";
import AudioInput from "./input/AudioInput";
import FileInput from "./input/FileInput";
import {
  useInputMessage,
  useIsMessageSending,
  useMessageStore,
  useSetInputMessage,
} from "@/lib/store/message.store";
import { useSocketStore } from "@/lib/store/socket.store";
import { useChatStore } from "@/lib/store/chat.store";
import { useUserStore } from "@/lib/store/user.store";
import {
  useMessageFileStore,
  useSendFileMessage,
} from "@/lib/store/file.store";
import { Button } from "@/components/ui/button";

const TYPING_TIMER_LENGTH = 3000;

const ChatInput = () => {
  const { socket } = useSocketStore();
  const { file, setFile, isFileSending } = useMessageFileStore();
  const messageSending = useIsMessageSending();
  const { userInfo } = useUserStore();
  const { currentChatUser } = useChatStore();
  const { sendMessage } = useMessageStore();
  const inputMessage = useInputMessage();
  const setInputMessage = useSetInputMessage();
  const sendFileMessage = useSendFileMessage();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emitTyping = useCallback(() => {
    if (socket && currentChatUser) {
      socket.emit("typing", {
        typer: userInfo?.name,
        to: currentChatUser?._id,
        chatId: currentChatUser?.chat_id,
        typing: true,
      });
    }
  }, [socket, userInfo, currentChatUser]);

  const emitStopTyping = useCallback(() => {
    if (socket && currentChatUser) {
      socket.emit("typing", {
        typer: userInfo?.name,
        to: currentChatUser?._id,
        chatId: currentChatUser?.chat_id,
        typing: false,
      });
    }
  }, [socket, userInfo, currentChatUser]);

  const handleInputChange = useCallback(
    (e) => {
      setInputMessage(e.target.value);
      emitTyping();
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Set a new timeout
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping();
      }, TYPING_TIMER_LENGTH);
    },
    [setInputMessage, emitTyping, emitStopTyping],
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") sendMessage();
      emitStopTyping();
    },
    [sendMessage, emitStopTyping],
  );

  const toggleEmojiPicker = useCallback((e) => {
    e.stopPropagation();
    setShowEmojiPicker((prev) => !prev);
  }, []);

  // Handle emoji selection
  const onEmojiClick = useCallback(
    (emojiObject) => {
      handleInputChange({
        target: { value: inputMessage + emojiObject.emoji },
      });
    },
    [inputMessage, handleInputChange],
  );

  // Close emoji picker when clicking outside
  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      emitStopTyping();
    };
  }, [emitStopTyping]);

  const handleRemoveImage = () => {
    setFile(null);
  };

  return (
    <div className="absolute inset-x-0 bottom-2.5 flex h-16 items-center justify-center">
      <div className="fixed bottom-20 right-5 rounded-md border border-black/20 bg-white shadow-md">
        {file && (
          <div className="flex flex-col items-center gap-3 p-3">
            <img
              src={URL.createObjectURL(file)}
              alt="Selected preview"
              className="h-52 w-full rounded object-contain"
            />
            <Button
              variant="outline"
              onClick={handleRemoveImage}
              className={`$ flex h-9 items-center rounded bg-black/10`}
            >
              <Trash2 />
            </Button>
          </div>
        )}
      </div>
      <div className="relative flex h-full w-[98%] items-center overflow-hidden rounded-xl border border-black/20 bg-white px-3">
        <FileInput />
        <AudioInput />
        <div
          onClick={toggleEmojiPicker}
          className="relative cursor-pointer"
          title="Open Emoji Picker"
        >
          <SmilePlus className="mx-3 size-5 text-black/50 transition-all duration-500 hover:text-zoyaprimary/80" />
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-16 left-10 z-50 rounded-md bg-white shadow-md"
            >
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                pickerStyle={{ width: "300px" }}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          className="h-full w-full border-none px-2 text-sm outline-none !ring-0"
          placeholder="Type text here..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <div
          onClick={() => {
            file ? sendFileMessage(inputMessage) : sendMessage();
          }}
          className="flex size-11 w-14 cursor-pointer items-center justify-center rounded-xl border bg-black/5 transition-all delay-200 duration-500 hover:scale-[1.07]"
          title="Send Message"
        >
          {isFileSending || messageSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <box-icon color="#6852D6" type="solid" name="send" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
