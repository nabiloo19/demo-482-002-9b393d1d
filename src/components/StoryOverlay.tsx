import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useRef, useCallback, useMemo } from "react";
import { type ThemeBubble } from "@/data/themes";
import AudioPlayer from "./AudioPlayer";

interface StoryOverlayProps {
  theme: ThemeBubble | null;
  onClose: () => void;
}

/** Parse "HH:MM:SS" or "MM:SS" to seconds */
const parseTimestamp = (ts: string): number => {
  const parts = ts.trim().split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
};

interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

/** Parse translation text with format: "00:00:05 - 00:00:12 | subtitle text" */
const parseSubtitles = (raw: string): SubtitleSegment[] => {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.includes("|"))
    .map((line) => {
      const [timePart, ...textParts] = line.split("|");
      const text = textParts.join("|").trim();
      const times = timePart.split("-").map((t) => t.trim());
      const start = parseTimestamp(times[0] || "0");
      const end = parseTimestamp(times[1] || "0");
      return { start, end, text };
    })
    .filter((s) => s.text.length > 0 && s.end > s.start);
};

const StoryOverlay = ({ theme, onClose }: StoryOverlayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  const subtitleSegments = useMemo(() => {
    if (!theme?.translation) return [];
    return parseSubtitles(theme.translation);
  }, [theme?.translation]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || subtitleSegments.length === 0) return;
    const currentTime = videoRef.current.currentTime;
    const active = subtitleSegments.find(
      (s) => currentTime >= s.start && currentTime < s.end
    );
    setCurrentSubtitle(active?.text || "");
  }, [subtitleSegments]);

  return (
    <AnimatePresence>
      {theme && theme.theme && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl rounded-2xl shadow-overlay overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto border border-border/30"
              style={{
                background: "hsl(var(--background) / 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-1.5 text-foreground/60 hover:text-foreground transition-colors rounded-full bg-secondary/60"
                aria-label="Close story"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className="flex flex-col gap-5 px-6 md:px-8 pt-8 pb-8">
                <div className="text-center">
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Theme
                  </p>
                  <h2 className="font-heading text-3xl md:text-4xl text-accent font-medium">
                    {theme.theme}
                  </h2>
                </div>

                {theme.bannerUrl && (
                  <div className="rounded-xl overflow-hidden aspect-video">
                    <img
                      src={theme.bannerUrl}
                      alt={theme.theme}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {theme.videoUrl && (
                  <div className="rounded-xl overflow-hidden relative">
                    <video
                      ref={videoRef}
                      src={theme.videoUrl}
                      controls
                      className="w-full aspect-video object-cover"
                      poster={theme.bannerUrl || undefined}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setCurrentSubtitle("")}
                    />
                    {currentSubtitle && (
                      <motion.div
                        key={currentSubtitle}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-12 left-4 right-4 text-center"
                      >
                        <span className="inline-block bg-background/80 backdrop-blur-sm text-foreground font-body text-sm md:text-base px-4 py-2 rounded-lg">
                          {currentSubtitle}
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}

                {theme.excerpt && (
                  <p className="font-body text-base text-muted-foreground leading-relaxed">
                    {theme.excerpt}
                  </p>
                )}

                {theme.audioUrl && <AudioPlayer src={theme.audioUrl} />}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoryOverlay;