import { Skeleton } from '@/components/ui/skeleton';
import { newRequest } from '@/endpoints';
import { START_CHAT } from '@/endpoints/chat';
import { SEND_NOTIFICATION } from '@/endpoints/notification';
import { GET_USERS } from '@/endpoints/user';
import {
    useChangeCurrentChatUser,
    useSetChatTab,
} from '@/lib/store/chat.store';
import { useSocket } from '@/lib/store/socket.store';
import { useUserStore } from '@/lib/store/user.store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCcw, Search, TicketCheck, User2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import { ContactItem } from './ContactItem';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ContactList() {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();
    const changeCurrentChatUser = useChangeCurrentChatUser();
    const setChatTab = useSetChatTab();
    const { userInfo } = useUserStore();
    const socket = useSocket();
    const [refreshing, isRefreshing] = useState(false);
    const requestSent = localStorage.getItem('request-sent') === 'true';

    const { data: userList, isLoading } = useQuery({
        queryKey: ['userList', userInfo?._id],
        queryFn: () => newRequest(GET_USERS),
        enabled: !!userInfo?._id,
    });

    let contactAvailable = userList?.data?.length ? true : false;

    const filteredUsers = userList?.data?.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRequestForSupport = async () => {
        try {
            const formData = {
                text: `Request for support member from ${userInfo?.name}`,
                from: userInfo?._id,
            };
            const res = await newRequest.post(SEND_NOTIFICATION, formData);
            if (res.status === 201) {
                localStorage.setItem('request-sent', 'true');
                const notification = {
                    ...res.data.notification,
                };
                socket.emit('send-notification', notification);
                queryClient.invalidateQueries(['userChats']);
                toast.success('Support request sent successfully');
            }
        } catch (error) {
            console.error(error);
            if (error?.response?.status === 400) {
                toast.success(error?.response?.data?.message);
            } else {
                toast.error('Failed to send support request');
            }
        }
    };

    const initChat = async (memberId) => {
        try {
            const res = await newRequest.post(START_CHAT, { memberId });
            if (res.status === 201) {
                queryClient.invalidateQueries(['userChats']);
                queryClient.invalidateQueries(['userList']);
                toast.success('Chat initiated successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to start chat');
        }
    };

    const startChat = (member) => {
        const user = {
            _id: member._id,
            name: member.name,
            avatar: member.avatar,
            lastMessage: { text: member.chat?.lastMessage },
            chat_id: member.chat?._id,
            chatStatus: member.chat?.status,
            totalUnreadMessages: member.chat?.unreadCount,
        };
        changeCurrentChatUser(user);
        setChatTab(1);
    };

    const refreshForSupportCheck = async () => {
        try {
            isRefreshing(true);
            await queryClient.invalidateQueries(['userList']);
            await queryClient.invalidateQueries(['userChats']);
            if (userList?.data?.length > 0) {
                localStorage.removeItem('request-sent');
            }
        } catch (error) {
            console.error('Error refreshing user list:', error);
        } finally {
            isRefreshing(false);
        }
    };

    return (
        <div className="flex w-full flex-col">
            <div className="flex h-16 items-center gap-3 px-4 text-sm">
                <Search className="size-4 text-gray-400" />
                <input
                    className="h-full w-full outline-none"
                    type="text"
                    placeholder="Search in contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <hr className="mx-2 border-gray-200" />
            <div className="flex max-h-[calc(100vh-140px)] flex-col gap-1 overflow-y-auto">
                {isLoading ? (
                    <ContactListSkeleton />
                ) : contactAvailable ? (
                    filteredUsers.map((user) => (
                        <ContactItem
                            key={user._id}
                            user={user}
                            startChat={startChat}
                            userInfo={userInfo}
                        />
                    ))
                ) : (
                    <NoContactsView
                        requestSent={requestSent}
                        handleRequestForSupport={handleRequestForSupport}
                        refreshForSupportCheck={refreshForSupportCheck}
                        refreshing={refreshing}
                        userInfo={userInfo}
                    />
                )}
            </div>
        </div>
    );
}

function ContactListSkeleton() {
    return (
        <div className="flex flex-col space-y-3 px-1 py-2">
            <Skeleton className="h-14 w-full rounded" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
}

function NoContactsView({
    requestSent,
    handleRequestForSupport,
    refreshForSupportCheck,
    refreshing,
    userInfo,
}) {
    return (
        <>
            {userInfo?.role === 'user' && (
                <>
                    <Button
                        onClick={handleRequestForSupport}
                        className={`mx-auto mt-3 h-12 w-[90%] ${
                            requestSent ? 'bg-blue-500' : 'bg-green-600'
                        }`}
                    >
                        {requestSent ? (
                            <>
                                <TicketCheck className="mr-2 size-5" />
                                Request Received
                            </>
                        ) : (
                            <>
                                Request Support
                                <User2Icon className="ml-2 size-5" />
                            </>
                        )}
                    </Button>
                    {requestSent && (
                        <Button
                            onClick={refreshForSupportCheck}
                            className="mx-auto mt-28 h-10 rounded-full bg-green-500 px-4 text-xs font-semibold"
                        >
                            <RefreshCcw
                                className={`size-4 ${refreshing && 'animate-spin'} `}
                            />
                            Refresh to check
                        </Button>
                    )}
                </>
            )}
        </>
    );
}
