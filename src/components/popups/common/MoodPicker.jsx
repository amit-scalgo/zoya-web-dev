import { useState, useEffect } from "react";
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

const MOOD_KEY = "lastMoodSelection";
const TIME_KEY = "lastMoodSelectionTime";
const HOURS_24 = 24 * 60 * 60 * 1000;

export function MoodPicker() {
  const { moodPickerOpen, setMoodPickerOpen } = useAppStore();
  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😠", label: "Angry" },
    { emoji: "😴", label: "Tired" },
    { emoji: "🤔", label: "Thoughtful" },
  ];

  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    const lastSelectionTime = localStorage.getItem(TIME_KEY);
    const lastMood = localStorage.getItem(MOOD_KEY);

    if (lastMood) {
      setSelectedMood(JSON.parse(lastMood));
    }

    if (lastSelectionTime) {
      const timeDiff = Date.now() - parseInt(lastSelectionTime, 10);
      if (timeDiff >= HOURS_24) {
        setMoodPickerOpen(true);
      }
    } else {
      setMoodPickerOpen(true);
    }
  }, []);

  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem(MOOD_KEY, JSON.stringify(mood));
    localStorage.setItem(TIME_KEY, Date.now().toString());
    setMoodPickerOpen(false);
  };

  return (
    <Dialog open={moodPickerOpen} onOpenChange={setMoodPickerOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <h2 className="mb-4 text-center text-2xl font-bold">
              How are you feeling?
            </h2>
          </DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-5 gap-1">
              {moods.map((mood) => (
                <Button
                  key={mood.label}
                  variant="outline"
                  className={cn(
                    "flex size-20 flex-col items-center justify-center text-2xl transition-all",
                    selectedMood?.label === mood.label &&
                      "bg-zoyaprimary text-white",
                  )}
                  onClick={() => handleMoodSelection(mood)}
                >
                  <span className="mb-0.5 text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-semibold">{mood.label}</span>
                </Button>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {selectedMood && (
            <p className="mt-4 text-center text-lg">
              You're feeling{" "}
              <span className="font-bold">{selectedMood.label}</span>{" "}
              {selectedMood.emoji}
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
