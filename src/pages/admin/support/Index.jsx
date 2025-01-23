import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { ADMIN_SUPPORT_LIST, ADMIN_SUPPORT_MEMBER } from "@/endpoints/admin";
import { DataTable } from "@/components/table/Table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { SupportSavePopup } from "@/components/admin/popups/user/Save";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteConfirmation } from "@/components/popups/DeleteConfirmation";
import { Link } from "react-router-dom";

export default function SupportListing() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const { data, totalPages, isLoading, setKeyword, keyword, currentPage } =
    usePagination({
      endpoint: ADMIN_SUPPORT_LIST,
      queryKey: "adminSupportMembers",
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
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => {
        const avatar = row.getValue("avatar");
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={row.original.name} />
            <AvatarFallback>
              {row.original.name?.charAt(0).toUpperCase()}
              {row.original.name?.charAt(1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <a
          href={`mailto:${row.getValue("email")}`}
          className="font-medium underline underline-offset-2"
        >
          {row.getValue("email")}
        </a>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => <span>{row.getValue("phoneNumber")?.toString()}</span>,
    },
    {
      accessorKey: "isVerified",
      header: "Verified",
      cell: ({ row }) => (
        <span>{row.getValue("isVerified") ? "Yes" : "No"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span>{date.toLocaleDateString()}</span>;
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
              Edit
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() => {
                setSelectedId(row.original?._id);
                setOpenDeletePopup(true);
              }}
            >
              Delete
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DeleteConfirmation
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        openDeletePopup={openDeletePopup}
        setOpenDeletePopup={setOpenDeletePopup}
        queryKey="adminSupportMembers"
        api={ADMIN_SUPPORT_MEMBER}
      />
      <div className="mt-5 flex flex-col">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/admin">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-zoyaprimary">
                  Support Members
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <SupportSavePopup
            api={ADMIN_SUPPORT_MEMBER}
            type="support"
            queryKey={"adminSupportMembers"}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
        <DataTable
          data={data}
          columns={columns}
          totalPages={totalPages}
          isLoading={isLoading}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </div>
    </>
  );
}
