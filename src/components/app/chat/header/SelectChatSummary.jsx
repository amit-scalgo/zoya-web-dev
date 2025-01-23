import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { newRequest } from "@/endpoints";
import { GET_USER_SUPPORT_LIST } from "@/endpoints/chat";
import { useAppStore } from "@/lib/store/app.store";
import { useChatStore } from "@/lib/store/chat.store";
import { useUserStore } from "@/lib/store/user.store";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";

export function SelectChatSummary() {
  const { setChatSummmaryOpen, chatSummmaryOpen, setChatSummaryId } =
    useAppStore();

  const { currentChatUser } = useChatStore();
  const { userInfo } = useUserStore();
  const { data: userSupportList, isLoading } = useQuery({
    queryKey: ["userSupportList", currentChatUser?._id],
    queryFn: () =>
      newRequest
        .get(`${GET_USER_SUPPORT_LIST}/${currentChatUser?._id}`)
        .then((res) => {
          return res?.data;
        }),
    enabled: !!currentChatUser?._id,
  });

  const handleSummarySelection = (chatId) => {
    setChatSummmaryOpen(true);
    setChatSummaryId(chatId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex h-9 w-full cursor-pointer items-center gap-1.5 rounded bg-zoyaprimary/10 px-3 text-sm font-semibold"
        >
          Summary <Info className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          {userSupportList?.map((i) => (
            <div
              onClick={() => handleSummarySelection(i?.chat_id)}
              key={i?.chat_id}
              className="flex cursor-pointer items-center gap-2"
            >
              <span className="text-sm font-bold">{i?.chatUser?.name}</span>
              {userInfo?._id !== i?.chatUser?._id && (
                <span className="text-sm text-gray-500"> - Previous Chat</span>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
