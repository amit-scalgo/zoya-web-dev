import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrainCircuit, HeartHandshake, Phone } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { OptionsPopover } from './OptionsPopover';
import { useSocketStore } from '@/lib/store/socket.store';
import { useUserStore } from '@/lib/store/user.store';
import { useChatStore } from '@/lib/store/chat.store';
import { SelectChatSummary } from './SelectChatSummary';
import { useAppStore } from '@/lib/store/app.store';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function ChatHeader() {
    const { currentChatUser } = useChatStore();
    const { makeCall } = useSocketStore();
    const { onlineUsers } = useUserStore();
    const { userInfo } = useUserStore();
    const { setChatSuggestionOpen } = useAppStore();

    const [ongoingCall, setOngoingCall] = useState(() => {
        const savedCall = localStorage.getItem('ongoingCall');
        return savedCall ? JSON.parse(savedCall) : null;
    });

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'ongoingCall') {
                setOngoingCall(
                    event.newValue ? JSON.parse(event.newValue) : null
                );
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleMakeCall = () => {
        if (ongoingCall) {
            toast.error(
                'You are already in a call. Please end the current call before starting a new one.'
            );
            return;
        }
        makeCall({
            currentChatUser,
            userInfo,
        });
    };

    return (
        <div className="flex h-16 w-full items-center justify-between border-b border-black/10 px-3 lg:px-5">
            <h5 className="flex items-center gap-1 text-base font-semibold capitalize text-black/70">
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
                <span className="flex flex-col">
                    {currentChatUser?.role === 'support' ? (
                        <div className="flex items-center gap-1">
                            <HeartHandshake /> Support{' '}
                            <span className="text-sm font-semibold">
                                ({`${currentChatUser?.name}`})
                            </span>
                        </div>
                    ) : (
                        <span className="text-sm font-bold">
                            {currentChatUser?.name}
                        </span>
                    )}
                    {currentChatUser?.chatStatus === 'active' && (
                        <div className="flex text-xs font-semibold text-black/50">
                            {onlineUsers?.includes(currentChatUser?._id)
                                ? 'Online'
                                : 'Offline'}
                        </div>
                    )}
                </span>
            </h5>
            {currentChatUser?.chatStatus &&
            currentChatUser?.chatStatus === 'closed' ? null : (
                <div className="flex items-center gap-5">
                    {userInfo?.role === 'support' && (
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => {
                                    setChatSuggestionOpen(true);
                                }}
                                variant="outline"
                                className="flex h-9 w-full cursor-pointer items-center gap-1.5 rounded bg-zoyaprimary/70 px-3 text-sm font-semibold text-white"
                            >
                                Suggestions <BrainCircuit />
                            </Button>
                            <SelectChatSummary />
                        </div>
                    )}
                    <div
                        onClick={handleMakeCall}
                        className="cursor-pointer text-black/70 transition-all duration-500 hover:text-zoyaprimary"
                    >
                        <Phone className="size-5" />
                    </div>
                    <OptionsPopover />
                </div>
            )}
        </div>
    );
}
