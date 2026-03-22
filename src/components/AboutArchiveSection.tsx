import { useRef, useState, useEffect, useMemo, useCallback } from "react";
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

/**
 * Generate scattered positions for bubbles along left and right edges
 * of the viewport, alternating sides.
 */
const generateScatteredPositions = (count: number) => {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? "left" : "right";
    const x = side === "left"
      ? 5 + Math.sin(i * 2.3) * 8 + (i % 3) * 3        // 5–20%
      : 80 + Math.cos(i * 1.7) * 8 + (i % 3) * 3;       // 80–95%
    const y = 8 + (i / count) * 80 + Math.sin(i * 3.1) * 5; // spread vertically
    positions.push({ x: Math.max(3, Math.min(97, x)), y: Math.max(5, Math.min(92, y)) });
  }
  return positions;
};

const AboutArchiveSection = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeBubble | null>(null);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const scatteredPositions = useMemo(
    () => generateScatteredPositions(themes.length),
    [themes.length]
  );

  const maxFrequency = useMemo(
    () => Math.max(...themes.map((t) => t.frequency)),
    [themes]
  );

  const getBubbleSize = useCallback((frequency: number) => {
    const minSize = isMobile ? 14 : 30;
    const maxSize = isMobile ? 75 : 185;
    return minSize + (frequency / maxFrequency) * (maxSize - minSize);
  }, [isMobile, maxFrequency]);

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

  // Track scroll progress through the container
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Animation completes in the first 2 viewport-heights of scroll.
      // The remaining scroll keeps the archive pinned and interactive.
      const scrolled = -rect.top;
      const animationDistance = viewportHeight * 2;
      const progress = Math.max(0, Math.min(1, scrolled / animationDistance));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Eased progress for smoother animation
  const easedProgress = useMemo(() => {
    // Ease in-out cubic
    const t = scrollProgress;
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, [scrollProgress]);

  // Are bubbles interactive? Only when fully formed (progress > 0.85)
  const bubblesInteractive = scrollProgress > 0.85;

  return (
    <>
      {/* Tall scroll container spanning About + Archive */}
      <div ref={scrollContainerRef} className="relative" style={{ height: "400vh" }}>
        {/* Sticky viewport — stays pinned while user scrolls through the container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* About text — fades out as bubbles move */}
          <div
            className="absolute inset-0 flex items-center justify-center z-10 px-6 md:px-10 pointer-events-none"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 2.5),
              transform: `translateY(${scrollProgress * -60}px)`,
            }}
          >
            <div className="max-w-3xl mx-auto text-center pointer-events-auto">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
                About the Project
              </p>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground mb-8 leading-tight">
                Carrying Home
                <br />
                <span className="italic text-accent">in Memory</span>
              </h2>

              <div className="space-y-6 font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                <p>
                  <em className="font-heading text-foreground text-lg md:text-xl">
                    Yemenis in Exile
                  </em>{" "}
                  is a digital storytelling archive that gathers the scattered memories
                  of the Yemeni diaspora — the rituals preserved in kitchens abroad,
                  the lullabies hummed in unfamiliar rooms, the textures of a homeland
                  felt across oceans.
                </p>
                <p>
                  Through audio recordings, moving images, and written testimonies,
                  this archive becomes a living document of displacement, resilience,
                  and the quiet acts of belonging that define a people in exile.
                </p>
                <p>
                  Each bubble on the map represents a recurring theme in the archive —
                  a thread connecting individual memories into a collective tapestry.
                  The larger the bubble, the more stories it holds.
                </p>
              </div>

              <div className="mt-16 pt-12 border-t border-border/30">
                <blockquote className="font-heading italic text-xl md:text-2xl text-foreground/80 max-w-xl mx-auto">
                  "We did not leave home. We carried it with us — in the way we brew
                  our coffee, in the songs we sing to our children."
                </blockquote>
                <p className="mt-4 font-body text-xs uppercase tracking-widest text-muted-foreground">
                  — From the Archive
                </p>
              </div>
            </div>
          </div>

          {/* Archive header — fades in */}
          <div
            className="absolute top-0 left-0 right-0 z-10 pt-20 pb-4 pointer-events-none"
            style={{
              opacity: Math.max(0, (scrollProgress - 0.5) * 3),
            }}
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
                The Archive
              </h2>
              <p className="font-body text-muted-foreground max-w-xl mx-auto">
                Explore the most common themes shared by Yemenis in exile. Click a bubble to hear their stories.
              </p>
            </div>
          </div>

          {/* Bubbles layer */}
          <div className="absolute inset-0" id="archive">
            {themes.map((bubble, index) => {
              const size = getBubbleSize(bubble.frequency);
              const isClickable = bubble.theme !== "" && bubblesInteractive;

              // Interpolate between scattered and grouped positions
              const scattered = scatteredPositions[index];
              const currentX = scattered.x + (bubble.x - scattered.x) * easedProgress;
              const currentY = scattered.y + (bubble.y - scattered.y) * easedProgress;

              return (
                <div
                  key={bubble.id}
                  className="absolute"
                  style={{
                    left: `${currentX}%`,
                    top: `${currentY}%`,
                    transform: "translate(-50%, -50%)",
                    transition: "none", // driven by scroll, not CSS transition
                    zIndex: bubble.theme ? 2 : 1,
                  }}
                >
                  <button
                    disabled={!isClickable}
                    onClick={() => isClickable && setSelectedTheme(bubble)}
                    className={`rounded-full ${getGlowClass(bubble.colorVariant)} flex items-center justify-center ${
                      isClickable ? "cursor-pointer bubble-hover" : "cursor-default"
                    } ${!bubblesInteractive && bubble.theme === "" ? "opacity-40" : ""}`}
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
      </div>

      <StoryOverlay
        theme={selectedTheme}
        onClose={() => setSelectedTheme(null)}
      />
    </>
  );
};

export default AboutArchiveSection;
