import { Archive, MessageSquareText, Phone, Users } from "lucide-react";
import UserChatList from "../list/ChatList";
import UserCallList from "../list/Calls";
import {
  useChatStore,
  useChatTab,
  useSetChatTab,
} from "@/lib/store/chat.store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ContactList } from "../list/ContactList";

export default function ChatSidebar() {
  const { userInfo } = useChatStore();
  const chatTab = useChatTab();
  const setChatTab = useSetChatTab();

  const enableTerm = userInfo?.role === "user";

  const tabs = [
    { id: 0, label: "Users", icon: Users },
    { id: 1, label: "Chats", icon: MessageSquareText },
    { id: 2, label: "Calls", icon: Phone },
    { id: 3, label: "Archive", icon: Archive },
  ];

  return (
    <div
      className={cn(
        "absolute inset-0 top-14 z-50 h-full flex-col justify-between border-r border-r-black/10 bg-white md:static md:w-72",
        enableTerm ? "hidden md:flex" : "flex",
      )}
    >
      {chatTab === 0 ? (
        <ContactList />
      ) : chatTab === 2 ? (
        <UserCallList />
      ) : (
        <UserChatList />
      )}
      <div className="flex h-14 items-center justify-between px-3">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-0.5 p-1 text-[0.64rem] font-semibold",
              chatTab === tab.id
                ? "font-bold text-zoyaprimary"
                : "text-muted-foreground",
            )}
            onClick={() => setChatTab(tab.id)}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
