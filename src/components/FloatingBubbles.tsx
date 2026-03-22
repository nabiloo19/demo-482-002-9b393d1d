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
 * Scattered positions for bubbles in the About section (left/right edges).
 * These are viewport-percentage positions within the About section.
 */
const scatteredPositions = [
  { x: 10, y: 16 },
  { x: 87, y: 14 },
  { x: 6, y: 31 },
  { x: 91, y: 28 },
  { x: 8, y: 48 },
  { x: 89, y: 46 },
  { x: 12, y: 64 },
  { x: 86, y: 62 },
  { x: 7, y: 78 },
  { x: 90, y: 80 },
  { x: 15, y: 24 },
  { x: 83, y: 74 },
  { x: 11, y: 88 },
  // Smaller decorative ones
  { x: 4, y: 20 },
  { x: 93, y: 22 },
  { x: 5, y: 55 },
  { x: 92, y: 52 },
  { x: 14, y: 72 },
  { x: 88, y: 38 },
  { x: 9, y: 42 },
  { x: 85, y: 86 },
  { x: 16, y: 58 },
  { x: 94, y: 68 },
  { x: 3, y: 84 },
  { x: 91, y: 12 },
];

const FloatingBubbles = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeBubble | null>(null);
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

  // Fetch themes
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

  const getBubbleSize = useCallback(
    (frequency: number) => {
      const minSize = isMobile ? 14 : 30;
      const maxSize = isMobile ? 75 : 185;
      return minSize + (frequency / maxFrequency) * (maxSize - minSize);
    },
    [isMobile, maxFrequency]
  );

  const getGlowClass = (variant: string) => {
    switch (variant) {
      case "rose":
      case "blush":
        return "bubble-glow-rose";
      case "gold":
      case "sand":
        return "bubble-glow-gold";
      default:
        return "bubble-glow-amber";
    }
  };

  // Track scroll: progress 0 = about section, 1 = archive section
  useEffect(() => {
    const handleScroll = () => {
      const about = aboutRef.current;
      const archive = archiveRef.current;
      if (!about || !archive) return;

      const aboutRect = about.getBoundingClientRect();
      const archiveRect = archive.getBoundingClientRect();
      const vh = window.innerHeight;

      // Start transition when about bottom reaches viewport center
      // End transition when archive top reaches viewport top
      const transitionStart = aboutRect.bottom - vh * 0.5;
      const transitionEnd = archiveRect.top;

      if (transitionStart >= transitionEnd) {
        // Sections overlap in viewport — just check which is more visible
        setProgress(archiveRect.top < vh * 0.5 ? 1 : 0);
        return;
      }

      // Map scroll position: before transitionStart = 0, after transitionEnd = 1
      const currentScroll = 0; // We measure relative to viewport
      const rawProgress = 1 - (transitionStart / (transitionStart - transitionEnd + 1));

      // Simpler: use the gap between about-bottom and archive-top
      const gap = archiveRect.top - aboutRect.bottom;
      const totalTransition = aboutRect.height * 0.5 + Math.max(gap, 0);
      const scrolledPast = vh * 0.5 - aboutRect.bottom;
      const p = Math.max(0, Math.min(1, scrolledPast / Math.max(totalTransition, 1)));

      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Eased progress
  const easedProgress = useMemo(() => {
    const t = progress;
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }, [progress]);

  const bubblesInteractive = progress > 0.9;

  return { themes, selectedTheme, setSelectedTheme, getBubbleSize, getGlowClass, easedProgress, bubblesInteractive, aboutRef, archiveRef };
};

// ─── About Section ────────────────────────────────────────────
export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative py-24 md:py-32 px-6 md:px-10 min-h-screen flex items-center"
    >
      <div className="max-w-3xl mx-auto text-center relative z-10">
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
    </section>
  );
};

// ─── Combined page with floating bubbles ──────────────────────
import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import ParticipateSection from "@/components/ParticipateSection";
import Footer from "@/components/Footer";
import StoryOverlay from "@/components/StoryOverlay";

const IndexPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeBubble | null>(null);
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

  // ... duplicated logic
};

export default IndexPage;
