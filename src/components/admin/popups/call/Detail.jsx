import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export function ViewCallDetail({
  isOpen,
  setIsOpen,
  selectedCallDetail,
  setSelectedCallDetail,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCallDetail(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const playRecording = (audioUrl) => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="py-5 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="capitalize">Call Details</DialogTitle>
        </DialogHeader>
        <DialogDescription className="font-medium">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint,
          voluptatibus illum harum provident at culpa minima deserunt.
        </DialogDescription>
        <div className="mt-5 grid gap-2 gap-y-4">
          <div className="flex items-center gap-2">
            <div className="text-[0.94rem] font-semibold">Call ID:</div>
            <div className="text-[0.94rem]">{selectedCallDetail?.callId}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[0.94rem] font-semibold">Support:</div>
            <div className="text-[0.94rem]">
              {selectedCallDetail?.support?.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[0.94rem] font-semibold">User:</div>
            <div className="text-[0.94rem]">
              {selectedCallDetail?.user?.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[0.94rem] font-semibold">Call Duration:</div>
            <div className="text-[0.94rem]">
              {selectedCallDetail?.duration === 0
                ? "N/A"
                : selectedCallDetail?.duration}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[0.94rem] font-semibold">Call Recorded:</div>
            <div className="text-[0.94rem]">
              {selectedCallDetail?.recordingLink ? "Yes" : "No"}
            </div>
          </div>
          {selectedCallDetail?.recordingLink && (
            <div className="flex flex-col gap-3">
              <div className="text-[0.94rem] font-semibold">Recording :</div>
              <div className="flex items-center gap-3">
                <AudioPlayer
                  src={selectedCallDetail.recordingLink}
                  onPlay={() => console.log("Playing audio...")}
                  customAdditionalControls={[]}
                  customVolumeControls={[]}
                  showJumpControls={false}
                />
                <Button type="button" className="text-[0.94rem]">
                  <a
                    href={selectedCallDetail?.recordingLink}
                    target="_blank"
                    className="flex items-center gap-1.5"
                    rel="noopener noreferrer"
                  >
                    <Download /> Download
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <div className="mt-7 flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              className="h-9 min-w-24 max-w-24 border"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </Dialog>
  );
}
