import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/store/user.store";
import {
  CallingState,
  ReactionsButton,
  SpeakerLayout,
  SpeakingWhileMutedNotification,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  Mic,
  MicOffIcon,
  Phone,
  PhoneCall,
  WifiHigh,
  WifiLow,
  WifiOffIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export const CallView = ({
  onEndCall,
  callingState,
  callDuration,
  setCallDuration,
}) => {
  const { useMicrophoneState, useCallSession, useCallMembers } =
    useCallStateHooks();
  const { userInfo } = useUserStore();
  const session = useCallSession();
  const members = useCallMembers();
  const { microphone, isMute } = useMicrophoneState();
  const caller =
    members?.find(({ user }) => user.id !== userInfo?._id)?.user || null;

  useEffect(() => {
    let timer;

    if (session?.started_at) {
      const startTime = new Date(session.started_at).getTime();

      timer = setInterval(() => {
        const elapsed = Math.max(0, Date.now() - startTime);
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setCallDuration(
          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
        );
      }, 1000);
    } else {
      setCallDuration("00:00");
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [session]);

  // Define a map of calling states to status messages and styles
  const callingStateMap = {
    [CallingState.RINGING]: {
      message: <PhoneCall className="size-3" />,
      style: "bg-yellow-300",
    },
    [CallingState.JOINING]: {
      message: <WifiLow className="size-3" />,
      style: "bg-blue-300",
    },
    [CallingState.JOINED]: {
      message: <WifiHigh className="size-3" />,
      style: "bg-green-300",
    },
    [CallingState.RECONNECTING]: {
      message: <WifiLow className="size-3" />,
      style: "bg-orange-300",
    },
    [CallingState.RECONNECTING_FAILED]: {
      message: <WifiLow className="size-3" />,
      style: "bg-red-500",
    },
    [CallingState.OFFLINE]: {
      message: <WifiOffIcon className="size-3" />,
      style: "bg-gray-400",
    },
  };

  const currentStatus = callingStateMap[callingState] || {
    message: "Unknown",
    style: "bg-gray-200",
  };

  return (
    <>
      <div className="invisible h-0">
        <SpeakerLayout />
      </div>
      <div className="relative mx-auto flex h-20 w-[70%] min-w-[70%] items-center justify-between rounded-2xl bg-white px-5 shadow-sm">
        <div
          className={`absolute left-0 top-0 flex h-5 w-7 items-center justify-center rounded-b text-xs font-semibold text-white ${currentStatus.style}`}
        >
          {currentStatus.message}
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-11 w-11 shadow">
            <AvatarImage src={caller?.image} alt={caller?.name} />
            <AvatarFallback
              className={`${!caller?.image ? "bg-zoyaprimary text-white" : ""} text-xs font-semibold`}
            >
              {caller?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="font-bold">{caller?.name}</h1>
        </div>
        <p className="font-bold text-black/80">{callDuration}</p>
        <div className="flex items-center gap-4">
          {/* <ReactionsButton /> */}
          <SpeakingWhileMutedNotification>
            <button
              onClick={() => microphone.toggle()}
              className={`flex h-10 w-10 items-center justify-center rounded-full p-2 ${
                isMute ? "bg-red-50" : "bg-green-50"
              } text-black`}
            >
              {isMute ? (
                <MicOffIcon className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          </SpeakingWhileMutedNotification>
          <button
            onClick={onEndCall}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 p-2 text-white"
          >
            <Phone className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
};
