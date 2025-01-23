import React, { useEffect, useMemo, useRef, useState } from "react";
import { newRequest } from "@/endpoints";
import { GET_MESSAGES } from "@/endpoints/chat";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatInput from "../ChatInput";
import ChatHeader from "../header/ChatHeader";
import MessageContainer from "../message/MessageContainer";
import ChatUserDetail from "@/components/popups/chat/ChatUserDetail";
import { useCurrentChatUser, useSetMessages } from "@/lib/store/chat.store";
import { useUserStore } from "@/lib/store/user.store";
import { useSocket } from "@/lib/store/socket.store";

export default function Chatbox() {
  const [typing, isTyping] = useState(false);
  const currentChatUser = useCurrentChatUser();
  const setMessages = useSetMessages();
  const socket = useSocket();
  const { userInfo } = useUserStore();
  const scrollableDivRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const lastScrollTopRef = useRef(0);
  const lastScrollHeightRef = useRef(0);
  const {
    data: userMessagesPages,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["userMessages", currentChatUser?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await newRequest(
        `${GET_MESSAGES}/${userInfo._id}/${currentChatUser._id}?page=${pageParam}`,
      );
      return {
        messages: response.data.messages,
        nextPage: response.data.nextPage ? response.data.nextPage : undefined,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? null;
    },
    enabled: !!currentChatUser?._id,
  });

  useEffect(() => {
    if (currentChatUser?._id) {
      refetch();
    }
  }, [currentChatUser?._id, refetch]);

  // check if currentChatUser is changed
  const allMessages = useMemo(() => {
    if (!userMessagesPages) return [];
    return userMessagesPages.pages
      .slice()
      .reduce((acc, page) => acc.concat(page.messages), []);
  }, [userMessagesPages]);

  const orderedMessages = useMemo(() => {
    return allMessages.reverse();
  }, [allMessages, currentChatUser]);

  useEffect(() => {
    setMessages(orderedMessages);
  }, [orderedMessages, setMessages, currentChatUser]);

  useEffect(() => {
    if (scrollableDivRef.current) {
      const scrollableDiv = scrollableDivRef.current;
      const currentScrollHeight = scrollableDiv.scrollHeight;
      const currentScrollTop = scrollableDiv.scrollTop;

      if (isInitialLoad) {
        // For initial load, keep scroll at the top
        scrollableDiv.scrollTop = 0;
        setIsInitialLoad(false);
      } else {
        // Calculate the difference in scroll height
        const scrollHeightDiff =
          currentScrollHeight - lastScrollHeightRef.current;

        // Adjust scroll position to maintain relative position
        scrollableDiv.scrollTop = lastScrollTopRef.current + scrollHeightDiff;
      }

      // Update refs for next render
      lastScrollTopRef.current = scrollableDiv.scrollTop;
      lastScrollHeightRef.current = currentScrollHeight;
    }
  }, [orderedMessages, isInitialLoad]);

  const handleScroll = () => {
    if (scrollableDivRef.current) {
      lastScrollTopRef.current = scrollableDivRef.current.scrollTop;
    }
  };

  const handleTypingReceive = (typingData) => {
    const { chatId, typing } = typingData;
    if (currentChatUser?.chat_id == chatId) {
      isTyping(typing);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("typing-receive", handleTypingReceive);
    return () => {
      socket.off("typing-receive", handleTypingReceive);
    };
  }, [currentChatUser, socket, handleTypingReceive]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <ChatUserDetail />
      <div className="relative h-screen w-full overflow-hidden">
        <ChatHeader />
        <div
          id="scrollableDiv"
          ref={scrollableDivRef}
          onScroll={handleScroll}
          className={`overflow-y-min flex h-full w-full flex-col-reverse overflow-y-auto ${
            currentChatUser?.chatStatus === "closed"
              ? "max-h-screen pb-14"
              : "max-h-[calc(100vh-110px)] min-h-[calc(100vh-110px)] pb-5"
          } ${
            isFetchingNextPage
              ? "before:animate-gradient-progress before:absolute before:inset-x-0 before:top-16 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500"
              : ""
          }`}
        >
          <InfiniteScroll
            dataLength={allMessages?.length || 0}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            inverse={true}
            scrollableTarget="scrollableDiv"
            scrollThreshold={0.9}
            pullDownToRefresh={false}
            className="px-5 py-3"
          >
            <MessageContainer />
            {typing ? (
              <div className="flex h-5 items-center text-xs font-semibold text-black/50">
                {currentChatUser?.name}
                <span className="ml-0.5">is typing</span>
                <img
                  className="mt-[1px] h-9"
                  src="/typing.gif"
                  alt="typing"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="h-5" />
            )}
          </InfiniteScroll>
        </div>
        {currentChatUser?.chatStatus !== "closed" && <ChatInput />}
      </div>
    </>
  );
}
