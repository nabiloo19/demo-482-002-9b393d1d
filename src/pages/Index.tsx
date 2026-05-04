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
import { RefreshCw } from "lucide-react";

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

interface DbSnippet {
  id: string;
  theme_id: string;
  video_url: string | null;
  audio_url: string | null;
  caption: string | null;
  translation: string | null;
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

const IndexPage = ({ variant = "default" }: { variant?: "default" | "exhibit" }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeBubble | null>(null);
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const archiveAreaRef = useRef<HTMLDivElement>(null);

  // Snippet state: which snippet id is "current" for each theme,
  // and which snippet ids the user has already viewed (per theme).
  const [currentByTheme, setCurrentByTheme] = useState<Record<string, string>>({});
  const [viewedByTheme, setViewedByTheme] = useState<Record<string, Set<string>>>({});
  const [retracting, setRetracting] = useState(false);
  const [burstId, setBurstId] = useState(0);

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

  const { data: dbSnippets } = useQuery({
    queryKey: ["snippets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("snippets").select("*");
      if (error) throw error;
      return data as DbSnippet[];
    },
  });

  // Group snippets by theme id
  const snippetsByTheme = useMemo(() => {
    const map: Record<string, DbSnippet[]> = {};
    (dbSnippets || []).forEach((s) => {
      if (!map[s.theme_id]) map[s.theme_id] = [];
      map[s.theme_id].push(s);
    });
    return map;
  }, [dbSnippets]);

  /** Pick a snippet id for a theme as randomly as possible using crypto entropy.
   *  We avoid repeating the immediately-previous snippet when there's more than one. */
  const pickSnippet = useCallback(
    (themeId: string, previousId?: string): string | undefined => {
      const pool = snippetsByTheme[themeId];
      if (!pool || pool.length === 0) return undefined;
      const candidates =
        pool.length > 1 && previousId
          ? pool.filter((s) => s.id !== previousId)
          : pool;
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      const idx = buf[0] % candidates.length;
      return candidates[idx].id;
    },
    [snippetsByTheme]
  );

  // Initialize current snippets when snippets load
  useEffect(() => {
    if (!dbSnippets) return;
    setCurrentByTheme((prev) => {
      const next = { ...prev };
      Object.keys(snippetsByTheme).forEach((themeId) => {
        if (!next[themeId]) {
          const picked = pickSnippet(themeId);
          if (picked) next[themeId] = picked;
        }
      });
      return next;
    });
  }, [dbSnippets, snippetsByTheme, pickSnippet]);

  /** Refresh: re-pick a fully random snippet for every theme. */
  const handleRefresh = useCallback(() => {
    if (retracting) return;
    setRetracting(true);
    setBurstId((n) => n + 1);
    // After retract animation, swap snippets and let them re-expand
    setTimeout(() => {
      setCurrentByTheme((prev) => {
        const next: Record<string, string> = {};
        Object.keys(snippetsByTheme).forEach((themeId) => {
          const picked = pickSnippet(themeId, prev[themeId]);
          if (picked) next[themeId] = picked;
        });
        return next;
      });
      setViewedByTheme((prev) => {
        const next: Record<string, Set<string>> = {};
        Object.keys(currentByTheme).forEach((themeId) => {
          const set = new Set(prev[themeId] || []);
          set.add(currentByTheme[themeId]);
          next[themeId] = set;
        });
        return next;
      });
      setRetracting(false);
    }, 700);
  }, [retracting, snippetsByTheme, viewedByTheme, currentByTheme, pickSnippet]);

  const themes: ThemeBubble[] = useMemo(() => {
    const attachSnippet = (t: ThemeBubble): ThemeBubble => {
      const snippetId = currentByTheme[t.id];
      if (!snippetId) return t;
      const snip = (snippetsByTheme[t.id] || []).find((s) => s.id === snippetId);
      if (!snip) return t;
      return {
        ...t,
        currentSnippet: {
          videoUrl: snip.video_url || undefined,
          audioUrl: snip.audio_url || undefined,
          caption: snip.caption || undefined,
          translation: snip.translation || undefined,
        },
      };
    };

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
      })).map(attachSnippet);
    }
    return staticThemes.map(attachSnippet);
  }, [dbThemes, currentByTheme, snippetsByTheme]);

  // Mark snippet viewed when overlay opens
  useEffect(() => {
    if (!selectedTheme) return;
    const snippetId = currentByTheme[selectedTheme.id];
    if (!snippetId) return;
    setViewedByTheme((prev) => {
      const set = new Set(prev[selectedTheme.id] || []);
      set.add(snippetId);
      return { ...prev, [selectedTheme.id]: set };
    });
  }, [selectedTheme, currentByTheme]);

  // "All viewed" hint: total snippets vs viewed snippets across themes
  const { totalSnippets, totalViewed } = useMemo(() => {
    let total = 0;
    let viewed = 0;
    Object.keys(snippetsByTheme).forEach((tid) => {
      total += snippetsByTheme[tid].length;
      viewed += (viewedByTheme[tid]?.size || 0);
    });
    return { totalSnippets: total, totalViewed: viewed };
  }, [snippetsByTheme, viewedByTheme]);

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
      <MemoryBurst burstId={burstId} />


      <Header variant={variant} />

      {/* About section (text only — bubbles rendered separately) */}
      <div ref={aboutRef}>
        <AboutSection />
      </div>

      {/* Archive section */}
      <section id="archive" className="relative py-10 md:py-14">
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

        {/* Refresh memories button */}
        {totalSnippets > 0 && (
          <div className="container mx-auto px-4 mt-6 flex flex-col items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={retracting}
              className="group inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 hover:bg-accent/20 px-5 py-3 font-body text-sm uppercase tracking-[0.2em] text-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Refresh memories"
            >
              <RefreshCw size={16} className={retracting ? "animate-spin" : "group-hover:rotate-90 transition-transform"} />
              {retracting ? "Retracting memories…" : "Refresh memories"}
            </button>
          </div>
        )}
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
        retracting={retracting}
      />

      {variant === "default" && <ParticipateSection />}
      {variant === "default" && <ContactSection />}
      {variant === "exhibit" && (
        <section className="relative py-14 md:py-16 px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-heading text-lg md:text-2xl text-foreground tracking-wide flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
              <span>tether</span>
              <span className="text-accent/60">|</span>
              <span>FADA Exhibition</span>
              <span className="text-accent/60">|</span>
              <span>04.05 - 2026</span>
              <span className="text-accent/60">|</span>
              <span>Bilkent University</span>
            </p>
          </div>
        </section>
      )}
      <Footer variant={variant} />

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
  retracting,
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
  retracting: boolean;
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

      // Collision resolution — push overlapping bubbles apart while keeping them
      // within the archive area when grouped. A few relaxation passes are enough.
      const radii = themes.map((b) => getBubbleSize(b.frequency) / 2);
      const padding = 6;
      const minLeft = archiveRect.left + 8;
      const maxLeft = archiveRect.right - 8;
      const minTop = archiveRect.top + 8;
      const maxTop = archiveRect.bottom - 8;
      for (let iter = 0; iter < 8; iter++) {
        for (let i = 0; i < newPositions.length; i++) {
          for (let j = i + 1; j < newPositions.length; j++) {
            const a = newPositions[i];
            const b = newPositions[j];
            const dx = b.left - a.left;
            const dy = b.top - a.top;
            const dist = Math.hypot(dx, dy) || 0.0001;
            const minDist = radii[i] + radii[j] + padding;
            if (dist < minDist) {
              const overlap = (minDist - dist) / 2;
              const nx = dx / dist;
              const ny = dy / dist;
              a.left -= nx * overlap;
              a.top -= ny * overlap;
              b.left += nx * overlap;
              b.top += ny * overlap;
            }
          }
        }
        // Clamp to archive bounds proportionally to grouping progress
        if (easedProgress > 0.4) {
          for (let i = 0; i < newPositions.length; i++) {
            const r = radii[i];
            newPositions[i].left = Math.min(maxLeft - r, Math.max(minLeft + r, newPositions[i].left));
            newPositions[i].top = Math.min(maxTop - r, Math.max(minTop + r, newPositions[i].top));
          }
        }
      }

      setPositions(newPositions);
    };

    calculate();
    window.addEventListener("scroll", calculate, { passive: true });
    window.addEventListener("resize", calculate, { passive: true });
    return () => {
      window.removeEventListener("scroll", calculate);
      window.removeEventListener("resize", calculate);
    };
  }, [themes, easedProgress, aboutRef, archiveAreaRef, getBubbleSize]);

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
                transform: retracting ? "scale(0)" : "scale(1)",
                transition: `transform 600ms cubic-bezier(0.5, 0, 0.2, 1) ${(index * 25) % 400}ms`,
                opacity: retracting ? 0 : 1,
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

/** Circle-ripple burst that plays on every refresh.
 *  Stays in the bubble visual language: soft amber/honey rings expanding outward. */
const MemoryBurst = ({ burstId }: { burstId: number }) => {
  const [rings, setRings] = useState<
    { id: string; left: number; top: number; size: number; delay: number; hue: number; thickness: number }[]
  >([]);

  useEffect(() => {
    if (burstId === 0) return;
    // A few concentric rings near center — gentle, focused, not scattered
    const count = 4;
    const list = Array.from({ length: count }).map((_, i) => ({
      id: `${burstId}-${i}`,
      left: 50,
      top: 55,
      size: 80 + i * 40,
      delay: i * 0.18,
      hue: 36 + Math.random() * 8,
      thickness: 1,
    }));
    setRings(list);
    const t = setTimeout(() => setRings([]), 3200);
    return () => clearTimeout(t);
  }, [burstId]);

  if (rings.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {rings.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            width: `${r.size}px`,
            height: `${r.size}px`,
            marginLeft: `-${r.size / 2}px`,
            marginTop: `-${r.size / 2}px`,
            border: `${r.thickness}px solid hsl(${r.hue} 70% 60% / 0.35)`,
            boxShadow: `0 0 18px hsl(${r.hue} 80% 55% / 0.18)`,
            animation: `memoryRipple 2800ms cubic-bezier(0.22, 1, 0.36, 1) ${r.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default IndexPage;
