import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { newRequest } from "@/endpoints";
import { CHAT_SUGGESTIONS } from "@/endpoints/chat";
import { useAppStore, useChatSuggestion } from "@/lib/store/app.store";
import { useCurrentChatUser, useMessages } from "@/lib/store/chat.store";
import { useMessageStore } from "@/lib/store/message.store";
import { useQuery } from "@tanstack/react-query";

export function ChatSuggestion() {
  const currentChatUser = useCurrentChatUser();
  const messages = useMessages();
  const { setChatSuggestionOpen } = useAppStore();
  const chatSuggestionOpen = useChatSuggestion();
  const { setInputMessage } = useMessageStore();
  let enableTerm = chatSuggestionOpen && currentChatUser?._id ? true : false;

  const { data: chatSugesstions, isLoading } = useQuery({
    queryKey: ["chatSugesstions", currentChatUser?._id, messages],
    queryFn: () =>
      newRequest
        .get(`${CHAT_SUGGESTIONS}/${currentChatUser?.chat_id}`)
        .then((res) => {
          return res?.data;
        }),
    enabled: enableTerm,
  });

  // Parse the JSON string from the code block
  const parseSuggestions = (response) => {
    if (!response) return [];
    try {
      const jsonMatch = response?.match(/```json\n([\s\S]*)\n```/);
      if (!jsonMatch?.[1]) return [];
      return JSON.parse(jsonMatch[1]);
    } catch (error) {
      console.error("Error parsing suggestions:", error);
      return [];
    }
  };

  const suggestions = parseSuggestions(chatSugesstions?.suggestions);

  const handleSelectSuggestion = (suggestion) => {
    setChatSuggestionOpen(false);
    setInputMessage(suggestion);
  };

  const handleClose = () => {
    setChatSuggestionOpen(false);
  };

  return (
    <Sheet open={chatSuggestionOpen} onOpenChange={setChatSuggestionOpen}>
      <SheetContent
        aria-describedby="chat-suggestions"
        className="overflow-y-min flex !max-w-md flex-col justify-between overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="-mb-1.5">Chat Suggestion</SheetTitle>
          <SheetDescription>
            Select any of the suggestions to respond with
          </SheetDescription>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="!mt-7 flex flex-col gap-3">
              {suggestions?.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="cursor-pointer rounded-lg border border-black/20 bg-black/5 p-2 text-[0.97rem] font-medium"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </SheetHeader>
        <SheetFooter>
          <div className="mt-1 flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              className="h-9 min-w-24 max-w-24 border"
            >
              Close
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
