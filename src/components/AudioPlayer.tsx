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

  // Generate static waveform bar heights
  const bars = useMemo(() => {
    return Array.from({ length: 48 }, () => 0.15 + Math.random() * 0.85);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !src) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setCurrentTime(audio.currentTime);
      setProgress(p);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleBarClick = (index: number) => {
    if (!audioRef.current || !src || !audioRef.current.duration) return;
    const newTime = (index / bars.length) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-full px-4 py-3 shadow-soft">
      {src && <audio ref={audioRef} src={src} preload="metadata" />}

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        disabled={!src}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-foreground text-card flex items-center justify-center hover:bg-foreground/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
          const barProgress = (i / bars.length) * 100;
          const isPlayed = barProgress <= progress;
          return (
            <div
              key={i}
              role="button"
              tabIndex={-1}
              onClick={() => handleBarClick(i)}
              className={`flex-1 rounded-full cursor-pointer min-w-[2px] transition-all duration-150 ${
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
