import { v4 as uuidv4 } from 'uuid';
import { newRequest } from '@/endpoints';
import { SAVE_CALL } from '@/endpoints/user';
import { create } from 'zustand';

const createSocketSlice = (set, get) => ({
    socket: undefined,
    streamClient: undefined,
    lastCallId: undefined,

    setStreamClient: (client) => {
        if (get().streamClient !== client) {
            set({ streamClient: client });
        }
    },

    setSocket: (socket) => {
        if (get().socket !== socket) {
            set({ socket });
        }
    },

    makeCall: async ({ currentChatUser, userInfo }) => {
        const { streamClient } = get();
        if (!streamClient) {
            console.error('Stream client not initialized');
            return;
        }

        try {
            const callId = uuidv4();
            const call = streamClient.call('default', callId);
            await call.getOrCreate({
                ring: true,
                data: {
                    created_by_id: userInfo?._id,
                    members: [
                        { user_id: currentChatUser?._id, role: 'call_member' },
                        { user_id: userInfo?._id, role: 'call_member' },
                    ],
                    custom: {
                        from_user: userInfo?._id,
                        to_user: currentChatUser?._id,
                    },
                },
            });

            const formData = {
                callId: callId,
                from: userInfo?._id,
                to: currentChatUser?._id,
                chatId: currentChatUser?.chat_id,
            };

            const res = await newRequest.post(SAVE_CALL, formData);
            if (res.status === 201) {
                console.log('Call saved successfully');
            } else {
                console.error('Failed to save call:', res.data.error);
            }
        } catch (error) {
            console.error('Failed to start call:', error);
        }
    },

    setLastCallId: (value) => {
        if (get().lastCallId !== value) {
            set({ lastCallId: value });
        }
    },
});

export const useSocketStore = create(createSocketSlice);

// Selector hooks
export const useSocket = () => useSocketStore((state) => state.socket);
export const useStreamClient = () =>
    useSocketStore((state) => state.streamClient);
export const useLastCallId = () => useSocketStore((state) => state.lastCallId);
export const useMakeCall = () => useSocketStore((state) => state.makeCall);
