import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React, { useEffect, useState } from 'react';
import { usePagination } from '@/hooks/usePagination';
import { ADMIN_CUSTOMER, ADMIN_CUSTOMER_LIST } from '@/endpoints/admin';
import { DataTable } from '@/components/table/Table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { SupportSavePopup } from '@/components/admin/popups/user/Save';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DeleteConfirmation } from '@/components/popups/DeleteConfirmation';
import { Link, useLocation } from 'react-router-dom';

export default function UserListing() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    // Get the values of specific parameters
    const request = searchParams.get('request');
    const open = searchParams.get('open');

    const [isOpen, setIsOpen] = useState(false);
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const { data, totalPages, isLoading, setKeyword, keyword, currentPage } =
        usePagination({
            endpoint: ADMIN_CUSTOMER_LIST,
            queryKey: 'adminCustomers',
        });

    useEffect(() => {
        if (open && request) {
            setSelectedId(request);
            setIsOpen(true);
        }
    }, [open, request, setIsOpen, setSelectedId]);

    const columns = [
        {
            header: 'Sl No',
            accessorKey: 'sno',
            cell: ({ row }) => {
                return (
                    <div className="flex px-2">
                        {row.index + 1 + (currentPage - 1) * 10}
                    </div>
                );
            },
        },
        {
            accessorKey: 'avatar',
            header: 'User',
            cell: ({ row }) => {
                const avatar = row.getValue('avatar');
                return (
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={avatar} alt={row.original.name} />
                            <AvatarFallback>
                                {row.original.name?.charAt(0).toUpperCase()}
                                {row.original.name?.charAt(1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span>{row.original?.name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: 'Support Assigned',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm font-medium">
                    {row.original?.dedicatedSupportUserId?.name ? (
                        <span>
                            {row.original?.dedicatedSupportUserId?.name}
                        </span>
                    ) : (
                        'N/A'
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <a
                    href={`mailto:${row.getValue('email')}`}
                    className="font-medium underline underline-offset-2"
                >
                    {row.getValue('email')}
                </a>
            ),
        },
        {
            accessorKey: 'phoneNumber',
            header: 'Phone Number',
            cell: ({ row }) => (
                <span>{row.getValue('phoneNumber')?.toString()}</span>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created On',
            cell: ({ row }) => {
                const date = new Date(row.getValue('createdAt'));
                return <span>{date.toLocaleDateString()}</span>;
            },
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
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
                        {/* <DropdownMenuItem>View</DropdownMenuItem> */}
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
                queryKey="adminCustomers"
                api={ADMIN_CUSTOMER}
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
                                    Users
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <SupportSavePopup
                        api={ADMIN_CUSTOMER}
                        type="user"
                        queryKey={'adminCustomers'}
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
