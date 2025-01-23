import React, { useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { ADMIN_CHAT_DETAIL, ADMIN_CHAT_LIST } from "@/endpoints/admin";
import { DataTable } from "@/components/table/Table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteConfirmation } from "@/components/popups/DeleteConfirmation";
import { ViewChatDetail } from "../../popups/chat/Detail";
import dayjs from "dayjs";

export default function ChatRecordListing() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const { data, totalPages, isLoading, setKeyword, keyword, currentPage } =
    usePagination({
      endpoint: ADMIN_CHAT_LIST,
      queryKey: "adminChatList",
    });

  const columns = [
    {
      header: "Sl No",
      accessorKey: "sno",
      cell: ({ row }) => {
        return (
          <div className="flex px-2">
            {row.index + 1 + (currentPage - 1) * 10}
          </div>
        );
      },
    },
    {
      accessorKey: "support",
      header: "Support",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={row.original?.support?.avatar}
                alt={row.original?.support?.name}
              />
              <AvatarFallback>
                {row.original?.support?.name?.charAt(0).toUpperCase()}
                {row.original?.support?.name?.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs font-semibold">
              {row.original?.support?.name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={row.original?.user?.avatar}
                alt={row.original.user?.name}
              />
              <AvatarFallback>
                {row.original.user?.name?.charAt(0).toUpperCase()}
                {row.original.user?.name?.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs font-semibold">
              {row.original?.user?.name ?? "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "lastMessage",
      header: "Last Message",
      cell: ({ row }) => {
        return (
          <span className="line-clamp-1 max-w-xs">
            {row.original?.lastMessage
              ? row.original?.lastMessage?.includes("recordings")
                ? "Voice message"
                : row.original?.lastMessage?.includes("cloudinary")
                  ? "Image"
                  : row.original?.lastMessage
              : "No messages yet"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span>{dayjs(date).fromNow()}</span>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setSelectedId(row.original?._id);
                setIsOpen(true);
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedId(row.original?._id);
                setOpenDeletePopup(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      {selectedId && (
        <ViewChatDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      )}
      <DeleteConfirmation
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        openDeletePopup={openDeletePopup}
        setOpenDeletePopup={setOpenDeletePopup}
        queryKey="adminChatList"
        api={ADMIN_CHAT_DETAIL}
      />
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        isLoading={isLoading}
        keyword={keyword}
        setKeyword={setKeyword}
      />
    </>
  );
}
