import React, { useEffect, useRef, useCallback } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { useAudioPlayerStore } from "@/lib/store/audio.store";

export default function VoiceNote({ audioBlob, loggedinUser, id }) {
  const containerRef = useRef(null);
  const { currentlyPlayingId, setCurrentlyPlayingId } = useAudioPlayerStore();

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    url: audioBlob,
    waveColor: loggedinUser ? "#fff" : "#ccc",
    progressColor: loggedinUser ? "#312b52" : "#4318FF",
    height: 34,
    barWidth: 4,
    barRadius: 3,
    cursorColor: "#fff",
  });

  const onPlayPause = useCallback(() => {
    if (wavesurfer) {
      if (currentlyPlayingId && currentlyPlayingId !== id) {
        setCurrentlyPlayingId(null);
      }
      wavesurfer.playPause();
      setCurrentlyPlayingId(isPlaying ? null : id);
    }
  }, [wavesurfer, id, currentlyPlayingId, setCurrentlyPlayingId, isPlaying]);

  useEffect(() => {
    if (
      wavesurfer &&
      currentlyPlayingId &&
      currentlyPlayingId !== id &&
      isPlaying
    ) {
      wavesurfer.pause();
    }
  }, [wavesurfer, currentlyPlayingId, id, isPlaying]);

  useEffect(() => {
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [wavesurfer]);

  return (
    <div className="flex w-full items-center justify-center gap-3">
      <div ref={containerRef} className="w-full min-w-48" />
      <button
        onClick={onPlayPause}
        className={`flex size-8 min-w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-500 hover:scale-[1.05] ${
          loggedinUser
            ? "bg-white hover:text-gray-400"
            : "bg-zoyaprimary text-black/40"
        }`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <box-icon
            color={loggedinUser ? "#6852D6" : "#fff"}
            name="pause"
            className="size-5 text-zoyaprimary"
          />
        ) : (
          <box-icon
            name="play"
            color={loggedinUser ? "#6852D6" : "#fff"}
            className="size-5"
          />
        )}
      </button>
    </div>
  );
}
