import React, { useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { ADMIN_CALL_LIST } from "@/endpoints/admin";
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
import { ViewCallDetail } from "../../popups/call/Detail";
import dayjs from "dayjs";

export default function CallRecordListing() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCallDetail, setSelectedCallDetail] = useState(null);
  const {
    data,
    totalPages,
    isLoading,
    setKeyword,
    keyword,
    status,
    setStatus,
    currentPage,
  } = usePagination({
    endpoint: ADMIN_CALL_LIST,
    queryKey: "adminCallList",
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
                {row.original.user?.name?.charAt(0).toUpperCase() ?? "D"}
                {row.original.user?.name?.charAt(1).toUpperCase() ?? "U"}
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
      accessorKey: "duration",
      header: "Call Duration",
      cell: ({ row }) => {
        console.log();
        return (
          <span className="line-clamp-1 !max-w-[17rem]">
            {row.getValue("duration") != 0 ? row.getValue("duration") : "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Call On",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span>{dayjs(date).fromNow()}</span>;
      },
    },
    {
      accessorKey: "callStatus",
      header: "Status",
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
                setSelectedCallDetail(row.original);
                setIsOpen(true);
              }}
            >
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      {selectedCallDetail && (
        <ViewCallDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedCallDetail={selectedCallDetail}
          setSelectedCallDetail={setSelectedCallDetail}
        />
      )}
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        isLoading={isLoading}
        keyword={keyword}
        setKeyword={setKeyword}
        status={status}
        setStatus={setStatus}
        pageType={"call"}
      />
      <div className="mb-7 flex px-5 text-[0.67rem] font-semibold text-black/50">
        *Note DU ^ Stands for deleted user
      </div>
    </>
  );
}
