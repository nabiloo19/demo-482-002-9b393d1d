import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { type ThemeBubble } from "@/data/themes";
import AudioPlayer from "./AudioPlayer";

interface StoryOverlayProps {
  theme: ThemeBubble | null;
  onClose: () => void;
}

const StoryOverlay = ({ theme, onClose }: StoryOverlayProps) => {
  return (
    <AnimatePresence>
      {theme && theme.theme && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-2xl bg-card/95 backdrop-blur-xl rounded-2xl shadow-overlay overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-1.5 text-card-foreground/60 hover:text-card-foreground transition-colors bg-card/60 backdrop-blur-sm rounded-full"
                aria-label="Close story"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className="flex flex-col gap-5 px-6 md:px-8 pt-8 pb-8">
                <div className="text-center">
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] text-card-foreground/50 mb-1.5">
                    Theme
                  </p>
                  <h2 className="font-heading text-3xl md:text-4xl text-primary font-medium">
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
                  <div className="rounded-xl overflow-hidden aspect-video">
                    <video
                      src={theme.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={theme.bannerUrl || undefined}
                    />
                  </div>
                )}

                {theme.excerpt && (
                  <p className="font-body text-base text-card-foreground/70 leading-relaxed">
                    {theme.excerpt}
                  </p>
                )}

                {theme.audioUrl && (
                  <AudioPlayer src={theme.audioUrl} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoryOverlay;
