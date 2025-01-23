import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useChangeCurrentChatUser,
  useChatList,
  useCurrentChatUser,
  useSetChatList,
  useSetChatListView,
  useSetRefetchUserChats,
} from "@/lib/store/chat.store";
import { useUserStore } from "@/lib/store/user.store";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ChatListCard from "../chatlist/Card";
import { useRefetchUserChats } from "@/hooks/useUserChats";

export default function UserChatList() {
  const isMobile = useIsMobile();
  const [keyword, setKeyword] = useState("");
  const { userInfo } = useUserStore();
  const chatList = useChatList();
  const currentChatUser = useCurrentChatUser();
  const changeCurrentChatUser = useChangeCurrentChatUser();
  const setChatList = useSetChatList();
  const setChatListView = useSetChatListView();
  const setRefetchUserChats = useSetRefetchUserChats();
  const { userChats, refetch, isLoading } = useRefetchUserChats(userInfo);

  useEffect(() => {
    setRefetchUserChats(refetch);
  }, [refetch, setRefetchUserChats]);

  useEffect(() => {
    if (userChats?.data && userInfo) {
      setChatList(
        userChats?.data?.map((i) => {
          return {
            chat_id: i?.chat_id,
            _id: i?.chatUser?._id,
            name: i?.chatUser?.name,
            avatar: i?.chatUser?.avatar,
            lastMessage: { text: i?.lastMessage },
            chatStatus: i?.status,
            totalUnreadMessages: i?.unreadCount,
          };
        }),
      );
    }
  }, [userInfo, userChats, setChatList]);

  const handleSelectUser = (user) => {
    changeCurrentChatUser(user);
    if (isMobile) {
      setChatListView(false);
    }
  };

  const filteredChatList = useMemo(
    () =>
      chatList?.filter(
        (chat) =>
          chat.name.toLowerCase().includes(keyword.toLowerCase()) ||
          chat.lastMessage?.text?.toLowerCase().includes(keyword.toLowerCase()),
      ),
    [chatList, userChats, keyword],
  );

  return (
    <section className="flex w-full flex-col">
      <div className="text-black/29 flex h-16 items-center gap-3 px-4 text-sm">
        <Search className="size-4 text-black/20" />
        <input
          className="h-full outline-none"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search in messages .."
        />
      </div>
      <hr className="mx-2 border-black/5" />
      <div className="overflow-y-min flex max-h-[calc(100vh-140px)] flex-col overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col space-y-3 px-1 py-2">
            <Skeleton className="h-14 w-full rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ) : (
          <>
            {filteredChatList?.map((user) => (
              <ChatListCard
                key={user?._id}
                user={user}
                currentChatUser={currentChatUser}
                handleSelectUser={handleSelectUser}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
