import { useState, useEffect } from "react";
import { useBoundStore } from "../../store/store";
import secondsToHMS from "../../utils/utils";
import WaveSurfer from "wavesurfer.js";
import "../App.css"; // Import the CSS file with progress bar styles

export default function Progress({
  formatTime,
  wavesurfer,
}: {
  formatTime: (seconds: number) => string;
  wavesurfer: WaveSurfer;
}) {
  const { nowPlaying } = useBoundStore();
  const [currentTime, setCurrentTime] = useState("0:00");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Update progress and current time during audio playback
    const updateProgress = () => {
      const current = wavesurfer.getCurrentTime();
      const duration = wavesurfer.getDuration();
      setProgress((current / duration) * 100 || 0);
      setCurrentTime(formatTime(current));
    };

    wavesurfer.on("audioprocess", updateProgress);

    return () => {
      wavesurfer.un("audioprocess", updateProgress);
    };
  }, [wavesurfer, formatTime]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    const duration = wavesurfer.getDuration();
    const newTime = (newProgress / 100) * duration;
    wavesurfer.seekTo(newTime / duration); // Update the audio position
  };

  return (
    <div className="flex w-full items-center justify-between">
      <p className="pr-2 text-[12px] text-white">{currentTime}</p>
      <div className="flex-1 mx-2">
        <input
          id="progress-bar"
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
        />
      </div>
      <p className="pl-2 text-[12px] text-white">
        {nowPlaying.track?.duration
          ? secondsToHMS(Number(nowPlaying.track?.duration))
          : ""}
      </p>
    </div>
  );
}
