import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store/app.store";
import { newRequest } from "@/endpoints";
import { UPDATE_CALL_RATING } from "@/endpoints/user";
import toast from "react-hot-toast";
import { useSocketStore } from "@/lib/store/socket.store";

export function SubmitCallRating() {
  const { callRatingOpen, setCallRatingOpen } = useAppStore();
  const { lastCallId, setLastCallId } = useSocketStore();
  const moods = [
    { emoji: "😊", label: "Happy", rating: 3 },
    { emoji: "😢", label: "Sad", rating: 2 },
    { emoji: "😠", label: "Angry", rating: 1 },
  ];
  const [selectedMood, setSelectedMood] = useState(null);

  const handleRatingSelection = (mood) => {
    setSelectedMood(mood);
    handleSubmitRating();
  };

  const handleSubmitRating = () => {
    try {
      const response = newRequest.post(UPDATE_CALL_RATING, {
        callId: lastCallId,
        rating: selectedMood?.rating,
      });
      if (response.status === 200) {
        toast.success("Thank you for submitting your rating");
        setLastCallId(undefined);
        setCallRatingOpen(false);
      } else {
        console.error("Failed to submit call rating:", response.data.error);
      }
    } catch (error) {
      console.error("Failed to submit call rating:", error);
    }
  };

  return (
    <Dialog open={callRatingOpen} onOpenChange={setCallRatingOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <h2 className="mb-4 py-3 text-center text-2xl font-bold">
              How was your experience talking with our support
            </h2>
          </DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-3 gap-3">
              {moods.map((mood) => (
                <Button
                  key={mood.label}
                  variant="outline"
                  className={cn(
                    "flex size-32 flex-col items-center justify-center text-2xl transition-all",
                    selectedMood?.label === mood.label &&
                      "bg-zoyaprimary text-white",
                  )}
                  onClick={() => handleRatingSelection(mood)}
                >
                  <span className="mb-0.5 text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-semibold">{mood.label}</span>
                </Button>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
