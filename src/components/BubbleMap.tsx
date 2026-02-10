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

  // Fetch themes from database
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

  // Convert DB themes to ThemeBubble format, fallback to static if DB is empty
  const themes: ThemeBubble[] = useMemo(() => {
    if (dbThemes && dbThemes.length > 0) {
      return dbThemes.map((t, i) => ({
        id: t.id,
        theme: t.theme,
        frequency: t.frequency,
        x: t.x,
        y: t.y,
        colorVariant: (t.color_variant as "blush" | "cream" | "sand") || "cream",
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
    const minSize = isMobile ? 16 : 28;
    const maxSize = isMobile ? 105 : 200;
    return minSize + (frequency / maxFrequency) * (maxSize - minSize);
  };

  const getColorClass = (variant: string) => {
    switch (variant) {
      case "blush": return "bg-bubble-blush";
      case "cream": return "bg-bubble-cream";
      case "sand": return "bg-bubble-sand";
      default: return "bg-bubble-cream";
    }
  };

  return (
    <>
      <div className="relative w-full aspect-square md:aspect-[16/9] max-h-[70vh]">
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
                  className={`rounded-full ${getColorClass(bubble.colorVariant)} flex items-center justify-center shadow-sm ${
                    isClickable ? "cursor-pointer bubble-hover" : "cursor-default opacity-70"
                  }`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    animation: `float ${6 + (bubble.frequency % 5)}s ease-in-out ${((index * 0.73) % 5).toFixed(2)}s infinite`,
                  }}
                >
                  {bubble.theme && size > 45 && (
                    <span
                      className={`font-heading text-foreground select-none pointer-events-none leading-tight text-center px-2 ${
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
