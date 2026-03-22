import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { themes as staticThemes, type ThemeBubble } from "@/data/themes";
import { useIsMobile } from "@/hooks/use-mobile";
import StoryOverlay from "./StoryOverlay";

interface DbTheme {
  id: string;
  theme: string;
  excerpt: string | null;
  frequency: number;
  x: number;
  y: number;
  color_variant: string;
  banner_url: string | null;
  audio_url: string | null;
  video_url: string | null;
}

const BubbleMap = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeBubble | null>(null);
  const isMobile = useIsMobile();

  const { data: dbThemes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .order("frequency", { ascending: false });
      if (error) throw error;
      return data as DbTheme[];
    },
  });

  const themes: ThemeBubble[] = useMemo(() => {
    if (dbThemes && dbThemes.length > 0) {
      return dbThemes.map((t) => ({
        id: t.id,
        theme: t.theme,
        frequency: t.frequency,
        x: t.x,
        y: t.y,
        colorVariant: (t.color_variant as "amber" | "rose" | "gold") || "amber",
        excerpt: t.excerpt || undefined,
        bannerUrl: t.banner_url || undefined,
        audioUrl: t.audio_url || undefined,
        videoUrl: t.video_url || undefined,
      }));
    }
    return staticThemes;
  }, [dbThemes]);

  const maxFrequency = useMemo(
    () => Math.max(...themes.map((t) => t.frequency)),
    [themes]
  );

  const getBubbleSize = (frequency: number) => {
    const minSize = isMobile ? 14 : 30;
    const maxSize = isMobile ? 75 : 185;
    return minSize + (frequency / maxFrequency) * (maxSize - minSize);
  };

  const getGlowClass = (variant: string) => {
    switch (variant) {
      case "rose":
      case "blush":
        return "bubble-glow-rose";
      case "gold":
      case "sand":
        return "bubble-glow-gold";
      case "amber":
      case "cream":
      default:
        return "bubble-glow-amber";
    }
  };

  return (
    <>
      <div className="relative w-full h-[75vh] sm:h-[65vh] md:h-[70vh]">
        <div className="absolute inset-0">
          {themes.map((bubble, index) => {
            const size = getBubbleSize(bubble.frequency);
            const isClickable = bubble.theme !== "";

            return (
              <div
                key={bubble.id}
                className="absolute"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <button
                  disabled={!isClickable}
                  onClick={() => isClickable && setSelectedTheme(bubble)}
                  className={`rounded-full ${getGlowClass(bubble.colorVariant)} flex items-center justify-center ${
                    isClickable ? "cursor-pointer bubble-hover" : "cursor-default opacity-50"
                  }`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    animation: `float ${6 + (bubble.frequency % 5)}s ease-in-out ${((index * 0.73) % 5).toFixed(2)}s infinite`,
                  }}
                >
                  {bubble.theme && size > 45 && (
                    <span
                      className={`font-heading text-foreground select-none pointer-events-none leading-tight text-center px-2 drop-shadow-sm ${
                        size > 150
                          ? "text-xl md:text-2xl"
                          : size > 110
                          ? "text-base md:text-lg"
                          : size > 75
                          ? "text-sm md:text-base"
                          : "text-xs"
                      }`}
                    >
                      {bubble.theme}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <StoryOverlay
        theme={selectedTheme}
        onClose={() => setSelectedTheme(null)}
      />
    </>
  );
};

export default BubbleMap;
