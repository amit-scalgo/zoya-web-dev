export default function RecordingTimer({ elapsedTime, maxDuration }) {
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };
  const progressBarWidth = (elapsedTime / maxDuration) * 100;

  return (
    <div className="flex w-full items-center gap-3">
      <div className="recording-timer w-10 text-sm font-bold">
        {formatTime(elapsedTime)}
      </div>
      <div className="flex h-10 w-full items-center justify-center rounded-full bg-black/10">
        <div className="relative h-2 w-[97%] rounded bg-white">
          <div
            className="absolute left-0 top-0 h-full rounded bg-zoyaprimary/90"
            style={{ width: `${progressBarWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}
