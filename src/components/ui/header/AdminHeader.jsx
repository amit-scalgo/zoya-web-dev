import React, { useCallback, useEffect } from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import { AdminNotificationPopup } from '@/components/admin/popups/notification/Popup';
import { InfoIcon } from 'lucide-react';
import { Input } from '../input';
import { useSocket } from '@/lib/store/socket.store';
import { useNotificationStore } from '@/lib/store/notification.store';
import { GET_NOTIFICATION } from '@/endpoints/notification';
import { newRequest } from '@/endpoints';
import { useQuery } from '@tanstack/react-query';

export default function AdminHeader() {
    const socket = useSocket();
    const { pauseNotification, setNotifications } = useNotificationStore();

    const { data } = useQuery({
        queryKey: ['adminNotifications'],
        queryFn: () =>
            newRequest.get(GET_NOTIFICATION).then((res) => {
                return res?.data?.notifications;
            }),
    });

    useEffect(() => {
        if (data?.length > 0) {
            setNotifications(data);
        }
    }, [data, setNotifications]);

    const addNotification = useNotificationStore(
        (state) => state.addNotification
    );

    useEffect(() => {
        if (socket && pauseNotification === false) {
            socket.on('notification-receive', (data) => {
                addNotification(data);
            });
            return () => {
                socket.off('notification-receive');
            };
        }
    }, [socket, addNotification]);

    return (
        <div className="flex justify-end py-1.5">
            <nav className="flex w-72 items-center gap-3 rounded-full border border-black/5 bg-white p-1 shadow-sm">
                <Input
                    className="rounded-full border border-black/5 bg-[#F4F7FE] shadow-none"
                    placeholder="Search ..."
                />
                <InfoIcon className="min-size-5 min-w-5 cursor-pointer text-black/40 hover:text-zoyaprimary" />
                <AdminNotificationPopup />
                <ProfileDropdown type="admin" />
            </nav>
        </div>
    );
}
