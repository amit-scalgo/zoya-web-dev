import { Maximize, Minimize } from "lucide-react";
import { useState } from "react";

export default function MaxView() {
  const [fullscreen, setFullscreen] = useState(false);
  const handleMaximizeClick = () => {
    const docElement = document.documentElement;
    if (!document.fullscreenElement) {
      docElement.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  return (
    <div className="flex">
      {fullscreen ? (
        <Minimize
          onClick={handleMaximizeClick}
          className="size-4 cursor-pointer text-black/30"
        />
      ) : (
        <Maximize
          onClick={handleMaximizeClick}
          className="size-4 cursor-pointer text-black/30"
        />
      )}
    </div>
  );
}
