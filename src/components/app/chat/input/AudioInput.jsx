import React, { useState, useRef, useEffect } from "react";
import { CircleStop, Mic, Trash2Icon } from "lucide-react";
import { useWavesurfer } from "@wavesurfer/react";
import { useMessageStore } from "@/lib/store/message.store";
import RecordingTimer from "./RecordingAnimation";

export default function AudioInput() {
  const { sendAudioMessage } = useMessageStore();
  const streamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const wavesurferRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const maxDuration = 300;

  useEffect(() => {
    if (audioBlob) {
      const file = new File([audioBlob], "recording.m4a", {
        type: "audio/m4a",
      });
      setAudioFile(file);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    }
  }, [audioBlob]);

  // Stop recording after max duration
  useEffect(() => {
    let timer;
    if (recording) {
      timer = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            alert("Maximum recording time of 5 minutes reached.");
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [recording]);

  // Start recording
  const startRecording = async () => {
    setRecording(true);
    setElapsedTime(0); // Reset elapsed time on new recording
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
      setAudioBlob(blob);
    };

    mediaRecorder.start();
  };

  // Stop recording
  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setElapsedTime(0); // Reset elapsed time when stopping
  };

  // Reset recording
  const resetRecording = () => {
    setAudioBlob(null);
    setAudioFile(null);
    setElapsedTime(0); // Reset elapsed time on reset
  };

  // Handle sending audio
  const handleSendAudio = () => {
    if (audioFile) {
      sendAudioMessage(audioFile);
      resetRecording();
    }
  };

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: wavesurferRef,
    url: audioURL,
    waveColor: "#ccc",
    progressColor: "#6852D6",
    height: 34,
    barWidth: 4,
    barRadius: 3,
    cursorColor: "transparent",
  });

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <>
      <div className="flex items-center gap-x-4">
        {recording ? (
          <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-between gap-5 border-black bg-white px-7">
            <RecordingTimer
              elapsedTime={elapsedTime}
              maxDuration={maxDuration}
            />
            <CircleStop
              onClick={stopRecording}
              className="size-7 min-h-7 min-w-7 animate-pulse cursor-pointer text-red-500 transition-all duration-300 hover:text-zoyaprimary/90"
            />
          </div>
        ) : (
          <Mic
            onClick={startRecording}
            className="size-5 cursor-pointer text-black/50 transition-all duration-300 hover:text-zoyaprimary/90"
          />
        )}
      </div>
      {audioBlob && (
        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-3 bg-white px-3">
          <div
            onClick={onPlayPause}
            className="flex size-8 min-w-8 cursor-pointer items-center justify-center rounded-full border border-black/5 transition-all duration-500 hover:scale-[1.05]"
          >
            {isPlaying ? (
              <box-icon color="#6852D6" name="pause" className="size-5" />
            ) : (
              <box-icon name="play" color="#6852D6" className="size-5" />
            )}
          </div>
          <div
            ref={wavesurferRef}
            className="w-full rounded-md border bg-black/5 px-2"
          />
          <Trash2Icon
            onClick={resetRecording}
            className="size-5 w-5 min-w-5 cursor-pointer text-black/50 hover:text-red-600"
            title="Discard Recording"
          />
          <div
            onClick={handleSendAudio}
            className="flex size-11 w-14 cursor-pointer items-center justify-center rounded-xl border bg-black/5 transition-all delay-200 duration-500 hover:scale-[1.07]"
            title="Send Message"
          >
            <box-icon color="#6852D6" type="solid" name="send" />
          </div>
        </div>
      )}
    </>
  );
}
