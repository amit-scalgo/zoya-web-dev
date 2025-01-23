import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { GET_USER_BYID } from "@/endpoints/user";
import { useChatStore } from "@/lib/store/chat.store";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function ChatUserDetail() {
  const { currentChatUser, chatUserDetailView, setChatUserDetailView } =
    useChatStore();

  let enabledTerm = currentChatUser?._id && chatUserDetailView;

  const { data: currentChatUserDetails, isLoading } = useQuery({
    queryKey: ["currentChatUserDetails", currentChatUser?._id],
    queryFn: () =>
      newRequest.get(`${GET_USER_BYID}/${currentChatUser?._id}`).then((res) => {
        return res?.data;
      }),
    enabled: enabledTerm,
  });

  const handleClose = () => {
    setChatUserDetailView(false);
  };

  return (
    <Sheet open={chatUserDetailView} onOpenChange={setChatUserDetailView}>
      <SheetContent className="flex !max-w-xs flex-col justify-between">
        <SheetHeader>
          <SheetTitle>User Info</SheetTitle>
          <div className="flex items-center gap-2 pt-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={currentChatUser?.avatar}
                alt={currentChatUser?.name}
              />
              <AvatarFallback className="bg-zoyaprimary text-xs font-semibold text-white">
                {currentChatUser?.name?.charAt(0).toUpperCase()}
                {currentChatUser?.name?.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h5 className="font-semibold">{currentChatUser?.name}</h5>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <SheetDescription className="flex flex-col gap-3 pb-2">
              <span className="underline underline-offset-2">
                {currentChatUserDetails?.email}
              </span>
              {currentChatUserDetails?.bio ?? null}
            </SheetDescription>
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
