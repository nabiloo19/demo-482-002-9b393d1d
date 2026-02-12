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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-2xl bg-card/90 backdrop-blur-xl rounded-2xl shadow-overlay overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-1.5 text-foreground/60 hover:text-foreground transition-colors bg-card/60 backdrop-blur-sm rounded-full"
                aria-label="Close story"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              {/* Theme heading */}
              <div className="text-center pt-8 pb-5 px-8">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                  Theme
                </p>
                <h2 className="font-heading text-3xl md:text-4xl text-foreground font-medium">
                  {theme.theme}
                </h2>
              </div>

              {/* Banner Image */}
              {theme.bannerUrl && (
                <div className="mx-6 rounded-xl overflow-hidden aspect-video">
                  <img
                    src={theme.bannerUrl}
                    alt={theme.theme}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Video */}
              {theme.videoUrl && (
                <div className={`mx-6 rounded-xl overflow-hidden aspect-video ${theme.bannerUrl ? 'mt-4' : ''}`}>
                  <video
                    src={theme.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster={theme.bannerUrl || undefined}
                  />
                </div>
              )}

              {/* Excerpt */}
              {theme.excerpt && (
                <div className="px-8 pt-5">
                  <p className="font-body text-base text-muted-foreground leading-relaxed">
                    {theme.excerpt}
                  </p>
                </div>
              )}

              {/* Audio Player */}
              {theme.audioUrl && (
                <div className="p-6">
                  <AudioPlayer src={theme.audioUrl} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoryOverlay;
