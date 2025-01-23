import { Phone } from "lucide-react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";

export default function RingingControl({ onReject, onAccept }) {
  const call = useCall();
  const { useCallMembers, useCallCreatedBy } = useCallStateHooks();
  const members = useCallMembers();
  const creator = useCallCreatedBy();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize audio only once
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/ringing.mp3");
      audioRef.current.loop = true;
      audioRef.current.onplaying = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
    }
    const playAudio = async () => {
      try {
        if (audioRef.current && audioRef.current.paused) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    playAudio();

    return () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isPlaying]);

  if (!call) return null;

  let membersToShow = [];
  if (call?.isCreatedByMe) {
    membersToShow =
      members
        ?.filter(({ user }) => user.id !== creator?.id)
        .map(({ user }) => user)
        .filter((u) => !!u) || [];
  } else if (creator) {
    membersToShow = [creator];
  }

  const displayMember = membersToShow[0];

  if (!displayMember) return null;

  return (
    <div className="mx-auto flex h-16 w-[57%] min-w-[57%] items-center justify-between rounded-2xl bg-white px-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Avatar className="h-11 w-11 shadow">
          <AvatarImage src={displayMember.image} alt={displayMember.name} />
          <AvatarFallback
            className={`${!displayMember.image ? "bg-zoyaprimary text-white" : ""} text-xs font-semibold`}
          >
            {displayMember.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {displayMember.name && (
          <div className="text-sm font-semibold">
            <span>{displayMember.name}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-3">
        {!call?.isCreatedByMe && (
          <div
            onClick={onAccept}
            className="flex h-9 cursor-pointer items-center justify-center gap-1 rounded-full bg-green-500 px-4 text-sm font-semibold text-white transition-all duration-500 hover:scale-[1.07]"
          >
            <Phone fill="white" className="size-4" />
            Accept
          </div>
        )}
        <div
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            onReject();
          }}
          className="flex h-9 cursor-pointer items-center justify-center gap-1 rounded-full bg-red-500 px-4 text-sm font-semibold text-white transition-all duration-500 hover:scale-[1.07]"
        >
          <Phone fill="white" className="size-4" />
          Cancel
        </div>
      </div>
    </div>
  );
}
