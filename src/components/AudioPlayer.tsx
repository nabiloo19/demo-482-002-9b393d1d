import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  src?: string;
}

const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Generate static waveform bar heights
  const bars = useMemo(() => {
    return Array.from({ length: 48 }, () => 0.15 + Math.random() * 0.85);
  }, []);

  // Reset state when src changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, src]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setCurrentTime(audio.currentTime);
    setProgress((audio.currentTime / audio.duration) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleBarClick = (index: number) => {
    const audio = audioRef.current;
    if (!audio || !src || !audio.duration) return;
    const newTime = (index / bars.length) * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / audio.duration) * 100);
  };

  return (
    <div className="flex items-center gap-3 bg-secondary/80 backdrop-blur-sm rounded-full px-4 py-3 shadow-soft">
      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        disabled={!src}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause size={15} fill="currentColor" />
        ) : (
          <Play size={15} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      {/* Waveform */}
      <div className="flex-1 flex items-end gap-[2px] h-8">
        {bars.map((height, i) => {
          const barPosition = ((i + 0.5) / bars.length) * 100;
          const isPlayed = barPosition <= progress;
          return (
            <div
              key={i}
              role="button"
              tabIndex={-1}
              onClick={() => handleBarClick(i)}
              className={`flex-1 rounded-full cursor-pointer min-w-[2px] transition-colors duration-100 ${
                isPlayed ? "bg-foreground/70" : "bg-foreground/15"
              }`}
              style={{ height: `${height * 100}%` }}
            />
          );
        })}
      </div>

      {/* Time */}
      <span className="flex-shrink-0 font-body text-xs text-muted-foreground tabular-nums w-10 text-right">
        {formatTime(currentTime)}
      </span>
    </div>
  );
};

export default AudioPlayer;
