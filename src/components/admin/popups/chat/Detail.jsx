import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { newRequest } from "@/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/ui/Loader";
import { ADMIN_CHAT_DETAIL } from "@/endpoints/admin";
import MessagesView from "./Message";
import Pagination from "@/components/table/Pagination";
import { useEffect, useState } from "react";

export function ViewChatDetail({
  isOpen,
  setIsOpen,
  selectedId,
  setSelectedId,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMessagesLog = async () => {
    const response = await newRequest(`${ADMIN_CHAT_DETAIL}/${selectedId}`, {
      params: {
        page: currentPage,
        pageSize: 20,
      },
    });
    if (response.status === 200) {
      return response.data?.data;
    } else {
      throw new Error("No messages found");
    }
  };

  const { data: messagesLog, isLoading } = useQuery({
    queryKey: ["messagesLog", selectedId, currentPage],
    queryFn: fetchMessagesLog,
    enabled: !!selectedId,
  });

  useEffect(() => {
    if (messagesLog?.pagination?.totalPages) {
      setTotalPages(messagesLog.pagination.totalPages);
    }
  }, [messagesLog, setTotalPages]);

  const handleClose = () => {
    setSelectedId("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="px-3 py-5 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">Details - (Messages)</DialogTitle>
        </DialogHeader>
        <DialogDescription className="font-medium"></DialogDescription>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {messagesLog?.messages && (
              <MessagesView
                messages={messagesLog?.messages}
                participants={messagesLog?.chatDetails?.participants}
              />
            )}
            <Pagination
              setTotalPages={setTotalPages}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              depkey={messagesLog?.pagination}
              margin={false}
            />
          </>
        )}

        <DialogFooter>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              className="h-9 min-w-24 max-w-24 border"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
