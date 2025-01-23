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
import { CHAT_SUMMARY } from "@/endpoints/chat";
import {
  useAppStore,
  useChatSummary,
  useSelectedSummary,
} from "@/lib/store/app.store";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function ChatSummary() {
  const { setChatSummmaryOpen } = useAppStore();
  const selectedSummaryId = useSelectedSummary();
  const chatSummmaryOpen = useChatSummary();

  const { data: chatSummary, isLoading } = useQuery({
    queryKey: ["chatSummary", selectedSummaryId],
    queryFn: () =>
      newRequest.get(`${CHAT_SUMMARY}/${selectedSummaryId}`).then((res) => {
        return res?.data;
      }),
    enabled: !!selectedSummaryId,
  });

  const handleClose = () => {
    setChatSummmaryOpen(false);
  };

  return (
    <Sheet open={chatSummmaryOpen} onOpenChange={setChatSummmaryOpen}>
      <SheetContent className="overflow-y-min flex !max-w-md flex-col justify-between overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="-mb-1.5">Chat Summary</SheetTitle>
          <SheetDescription>
            View the summary of the selected chat. The summary is generated
            based on the messages exchanged in the chat.
            {chatSummary?.summary === "" && (
              <div className="py-2 text-center">No summary available.</div>
            )}
          </SheetDescription>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="!mt-7 rounded-md bg-black/5 p-4 text-[0.97rem] font-medium">
              {chatSummary?.summary}
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
