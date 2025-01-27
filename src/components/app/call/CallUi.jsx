import React, { useEffect, useState, useRef } from 'react';
import { newRequest } from '@/endpoints';
import { END_CALL, SAVE_CALL } from '@/endpoints/user';
import {
    useCallStateHooks,
    CallingState,
    useCalls,
} from '@stream-io/video-react-sdk';
import { useAppStore } from '@/lib/store/app.store';
import { useSocketStore } from '@/lib/store/socket.store';
import { ArrowLeftFromLine } from 'lucide-react';
import RingingControl from './RingingControl';
import { CallView } from './CallVIew';
import { useQueryClient } from '@tanstack/react-query';

export const CallUi = ({
    call,
    setCallStatus,
    setOngoingCall,
    handleAnswerCall,
}) => {
    const [callId, setCallId] = useState(null);
    const [callDuration, setCallDuration] = useState('00:00');
    const queryClient = useQueryClient();
    const { setLastCallId } = useSocketStore();
    const { setCallRatingOpen } = useAppStore();
    const { useCallCallingState, useParticipants } = useCallStateHooks();
    const callingState = useCallCallingState();
    const participants = useParticipants();
    const [showPoorConnectionMessage, setShowPoorConnectionMessage] =
        useState(false);

    useEffect(() => {
        if (call) {
            setCallId(call?.id);
        }
    }, [call]);

    const calls = useCalls();
    const ongoingCall = calls.find(
        (call) => call.state.callingState === CallingState.JOINED
    );

    const callStartTimeRef = useRef(null);

    const handleCallEnd = async () => {
        try {
            await call.endCall();
            const response = await newRequest.post(END_CALL, {
                callId: callId,
                callStatus: 'Ended',
                endedAt: new Date(),
                duration: callDuration,
            });
            if (response.status === 200) {
                setCallRatingOpen(true);
                setLastCallId(call?.id);
                queryClient.invalidateQueries(['callLists']);
            }
        } catch (error) {
            if (error?.message?.includes('already been left')) {
                console.log('Call already ended');
            }
        }
    };

    const handleAcceptCall = async () => {
        try {
            if (callingState === CallingState.RINGING) {
                if (ongoingCall) {
                    await ongoingCall.endCall();
                }
                await call.join();
                handleAnswerCall();
                const response = await newRequest.post(SAVE_CALL, {
                    callId: call.id,
                    callStatus: 'Answered',
                    answeredAt: new Date(),
                    answered: true,
                });
                console.log(response);
            }
        } catch (error) {
            console.error('Failed to accept call:', error);
        }
    };

    const handleRejectCall = async () => {
        try {
            if (callingState === CallingState.RINGING) {
                const reason = call.isCreatedByMe ? 'cancel' : 'decline';
                await call.leave({ reject: true, reason });
                queryClient.invalidateQueries(['callLists']);
            }
        } catch (error) {
            console.error('Failed to reject call:', error);
        }
    };

    useEffect(() => {
        if (callingState === CallingState.JOINED && !callStartTimeRef.current) {
            callStartTimeRef.current = Date.now();
            console.log('Call started at:', callStartTimeRef.current);
        }
    }, [callingState]);

    useEffect(() => {
        call.setDisconnectionTimeout(30);
        let poorConnectionTimer;
        let endCallTimer;

        const handlePoorConnection = () => {
            console.log('Checking poor connection');
            const currentTime = Date.now();
            const callDuration = callStartTimeRef.current
                ? currentTime - callStartTimeRef.current
                : 0;

            if (callDuration > 40000) {
                // 40 seconds
                console.log('Poor connection detected');
                setShowPoorConnectionMessage(true);
                endCallTimer = setTimeout(() => {
                    handleCallEnd();
                }, 30000); // 30 seconds
            }
        };

        if (
            callingState === CallingState.JOINED &&
            participants?.length === 1 &&
            callStartTimeRef.current
        ) {
            poorConnectionTimer = setInterval(handlePoorConnection, 5000); // Check every 5 seconds
        } else {
            setShowPoorConnectionMessage(false);
            if (endCallTimer) clearTimeout(endCallTimer);
        }

        return () => {
            if (poorConnectionTimer) clearInterval(poorConnectionTimer);
            if (endCallTimer) clearTimeout(endCallTimer);
        };
    }, [callingState, participants]);

    if (showPoorConnectionMessage) {
        return (
            <div className="absolute inset-0 z-[52] flex h-screen min-h-fit w-full items-center justify-center bg-white py-10 md:bg-black/50">
                <div className="flex max-w-md flex-col items-center rounded-lg bg-white p-8 text-center shadow-md">
                    <div className="mb-5 flex items-center gap-3 text-2xl font-bold">
                        Trying to reconnect <ArrowLeftFromLine />
                    </div>
                    <p className="mb-4 text-[0.94rem]">
                        The other participant has left the call or there might
                        be a connection issue. The call will end soon if the
                        connection doesn't improve.
                    </p>
                    <button
                        onClick={handleCallEnd}
                        className="mt-7 rounded bg-red-500 px-3 py-2 text-sm text-white transition-colors hover:bg-red-600"
                    >
                        Leave
                    </button>
                </div>
            </div>
        );
    }

    if (callingState === CallingState.RINGING) {
        return (
            <RingingControl
                onReject={handleRejectCall}
                onAccept={handleAcceptCall}
            />
        );
    } else {
        return (
            <CallView
                call={call}
                onEndCall={handleCallEnd}
                callingState={callingState}
                callDuration={callDuration}
                setCallDuration={setCallDuration}
            />
        );
    }
};
