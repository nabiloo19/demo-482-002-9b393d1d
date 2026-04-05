import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { themes as staticThemes, type ThemeBubble } from "@/data/themes";
import { useIsMobile } from "@/hooks/use-mobile";
import StoryOverlay from "@/components/StoryOverlay";
import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import ParticipateSection from "@/components/ParticipateSection";
import Footer from "@/components/Footer";

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

/** Scattered positions: bubbles sit on left/right edges during the About section */
const SCATTERED: { x: number; y: number }[] = [
  { x: 14, y: 14 }, { x: 84, y: 12 }, { x: 12, y: 30 }, { x: 86, y: 26 },
  { x: 15, y: 46 }, { x: 83, y: 44 }, { x: 18, y: 62 }, { x: 80, y: 60 },
  { x: 13, y: 76 }, { x: 85, y: 78 }, { x: 20, y: 22 }, { x: 78, y: 72 },
  { x: 16, y: 86 },
  // small decorative
  { x: 10, y: 18 }, { x: 88, y: 20 }, { x: 11, y: 52 }, { x: 87, y: 50 },
  { x: 19, y: 70 }, { x: 82, y: 36 }, { x: 16, y: 40 }, { x: 79, y: 84 },
  { x: 21, y: 56 }, { x: 85, y: 66 }, { x: 10, y: 82 }, { x: 88, y: 14 },
];

const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const IndexPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeBubble | null>(null);
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const archiveAreaRef = useRef<HTMLDivElement>(null);

  // ── Data ──
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
        colorVariant: (t.color_variant as ThemeBubble["colorVariant"]) || "amber",
        excerpt: t.excerpt || undefined,
        bannerUrl: t.banner_url || undefined,
        audioUrl: t.audio_url || undefined,
        videoUrl: t.video_url || undefined,
        translation: (t as any).translation || undefined,
      }));
    }
    return staticThemes;
  }, [dbThemes]);

  const maxFreq = useMemo(() => Math.max(...themes.map((t) => t.frequency)), [themes]);

  const getBubbleSize = useCallback(
    (freq: number) => {
      const min = isMobile ? 14 : 30;
      const max = isMobile ? 75 : 185;
      return min + (freq / maxFreq) * (max - min);
    },
    [isMobile, maxFreq]
  );

  const getGlowClass = (v: string) => {
    if (v === "honey") return "bubble-glow-honey";
    if (v === "saffron") return "bubble-glow-saffron";
    if (v === "sand") return "bubble-glow-sand";
    if (v === "gold") return "bubble-glow-gold";
    return "bubble-glow-amber";
  };

  // ── Scroll tracking ──
  // progress 0 → bubbles scattered (about section)
  // progress 1 → bubbles grouped (archive section)
  useEffect(() => {
    const onScroll = () => {
      const about = aboutRef.current;
      const archive = archiveAreaRef.current;
      if (!about || !archive) return;

      const aboutBottom = about.getBoundingClientRect().bottom;
      const archiveTop = archive.getBoundingClientRect().top;
      const vh = window.innerHeight;

      // Transition starts when the about section bottom is at 70% of viewport
      // Transition ends when the archive section top is at 30% of viewport
      const start = aboutBottom - vh * 0.7;
      const end = archiveTop - vh * 0.3;

      if (start <= 0 && end <= 0) {
        setProgress(1);
      } else if (start >= 0) {
        setProgress(0);
      } else {
        const p = Math.max(0, Math.min(1, -start / Math.max(Math.abs(start) + end, 1)));
        setProgress(p);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const easedProgress = useMemo(() => easeInOutQuad(progress), [progress]);
  const bubblesInteractive = progress > 0.9;

  // ── Compute positions for each bubble ──
  // At progress=0: scattered positions (relative to about section)
  // At progress=1: grouped positions (relative to archive area)
  // We convert both to page-absolute pixel positions, then interpolate.

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grain-overlay" />


      <Header />

      {/* About section (text only — bubbles rendered separately) */}
      <div ref={aboutRef}>
        <AboutSection />
      </div>

      {/* Archive section */}
      <section id="archive" className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-2">
            The Archive
          </h2>
          <p className="font-body text-muted-foreground text-center max-w-xl mx-auto mb-8">
            Explore the most common themes shared by Yemenis in exile. Tap a bubble to hear their stories.
          </p>
        </div>
        {/* This is the target area where bubbles group */}
        <div ref={archiveAreaRef} className="relative w-full h-[75vh] sm:h-[65vh] md:h-[70vh]">
          {/* Bubbles are rendered here when grouped */}
        </div>
      </section>

      {/* ── Bubble layer ── */}
      {/* Positioned absolutely; each bubble's position is interpolated */}
      <BubbleLayer
        themes={themes}
        getBubbleSize={getBubbleSize}
        getGlowClass={getGlowClass}
        easedProgress={easedProgress}
        bubblesInteractive={bubblesInteractive}
        aboutRef={aboutRef}
        archiveAreaRef={archiveAreaRef}
        onSelect={setSelectedTheme}
        isMobile={isMobile}
      />

      <ParticipateSection />
      <ContactSection />
      <Footer />

      <StoryOverlay theme={selectedTheme} onClose={() => setSelectedTheme(null)} />
    </main>
  );
};

/** Renders the bubbles as fixed-position elements that move between About and Archive */
const BubbleLayer = ({
  themes,
  getBubbleSize,
  getGlowClass,
  easedProgress,
  bubblesInteractive,
  aboutRef,
  archiveAreaRef,
  onSelect,
  isMobile,
}: {
  themes: ThemeBubble[];
  getBubbleSize: (f: number) => number;
  getGlowClass: (v: string) => string;
  easedProgress: number;
  bubblesInteractive: boolean;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  archiveAreaRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (t: ThemeBubble) => void;
  isMobile: boolean;
}) => {
  const [positions, setPositions] = useState<{ left: number; top: number }[]>([]);

  // Recalculate positions on scroll and resize
  useEffect(() => {
    const calculate = () => {
      const about = aboutRef.current;
      const archive = archiveAreaRef.current;
      if (!about || !archive) return;

      const aboutRect = about.getBoundingClientRect();
      const archiveRect = archive.getBoundingClientRect();

      const newPositions = themes.map((bubble, i) => {
        const scattered = SCATTERED[i % SCATTERED.length];

        // Scattered: position relative to About section
        const scatteredLeft = aboutRect.left + (scattered.x / 100) * aboutRect.width;
        const scatteredTop = aboutRect.top + (scattered.y / 100) * aboutRect.height;

        // Grouped: position relative to Archive bubble area
        const groupedLeft = archiveRect.left + (bubble.x / 100) * archiveRect.width;
        const groupedTop = archiveRect.top + (bubble.y / 100) * archiveRect.height;

        // Interpolate
        const left = scatteredLeft + (groupedLeft - scatteredLeft) * easedProgress;
        const top = scatteredTop + (groupedTop - scatteredTop) * easedProgress;

        return { left, top };
      });

      setPositions(newPositions);
    };

    calculate();
    window.addEventListener("scroll", calculate, { passive: true });
    window.addEventListener("resize", calculate, { passive: true });
    return () => {
      window.removeEventListener("scroll", calculate);
      window.removeEventListener("resize", calculate);
    };
  }, [themes, easedProgress, aboutRef, archiveAreaRef]);

  if (positions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {themes.map((bubble, index) => {
        const size = getBubbleSize(bubble.frequency);
        const isClickable = bubble.theme !== "" && bubblesInteractive;
        const pos = positions[index];
        if (!pos) return null;

        return (
          <div
            key={bubble.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${pos.left}px`,
              top: `${pos.top}px`,
              transform: "translate(-50%, -50%)",
              zIndex: bubble.theme ? 2 : 1,
            }}
          >
            <button
              disabled={!isClickable}
              onClick={() => isClickable && onSelect(bubble)}
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
  );
};

export default IndexPage;
