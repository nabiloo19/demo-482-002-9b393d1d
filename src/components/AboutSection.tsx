import { useMemo } from "react";
import { themes } from "@/data/themes";
import { useIsMobile } from "@/hooks/use-mobile";

const aboutBubblePositions = [
  { x: 10, y: 16 },
  { x: 87, y: 14 },
  { x: 13, y: 31 },
  { x: 84, y: 28 },
  { x: 12, y: 48 },
  { x: 88, y: 46 },
  { x: 16, y: 64 },
  { x: 83, y: 64 },
  { x: 11, y: 80 },
  { x: 87, y: 82 },
  { x: 20, y: 24 },
  { x: 78, y: 76 },
];

const AboutSection = () => {
  const isMobile = useIsMobile();

  const visibleThemes = useMemo(() => themes.filter((theme) => theme.theme).slice(0, 12), []);
  const maxFrequency = useMemo(() => Math.max(...visibleThemes.map((theme) => theme.frequency)), [visibleThemes]);

  const getBubbleSize = (frequency: number) => {
    const minSize = isMobile ? 60 : 92;
    const maxSize = isMobile ? 112 : 168;
    return minSize + (frequency / maxFrequency) * (maxSize - minSize);
  };

  const getGlowClass = (variant: string) => {
    switch (variant) {
      case "rose":
        return "bubble-glow-rose";
      case "gold":
        return "bubble-glow-gold";
      case "amber":
      default:
        return "bubble-glow-amber";
    }
  };

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 px-6 md:px-10 overflow-hidden min-h-screen flex items-center"
    >
      <div className="absolute inset-0 pointer-events-none">
        {visibleThemes.map((bubble, index) => {
          const position = aboutBubblePositions[index];
          const size = getBubbleSize(bubble.frequency);
          const isLeft = position.x < 50;

          return (
            <div
              key={bubble.id}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
                animation: `float ${6 + (index % 4)}s ease-in-out ${(index * 0.35).toFixed(2)}s infinite`,
              }}
            >
              <div
                className={`rounded-full ${getGlowClass(bubble.colorVariant)} flex items-center justify-center text-center px-3 ${
                  isMobile ? "opacity-80" : "opacity-90"
                }`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  filter: "blur(0.2px)",
                }}
              >
                <span
                  className={`font-heading text-foreground leading-tight drop-shadow-sm ${
                    size > 140
                      ? "text-xl"
                      : size > 115
                      ? "text-base"
                      : "text-sm"
                  }`}
                >
                  {bubble.theme}
                </span>
              </div>

              <div
                className={`absolute top-1/2 ${isLeft ? "left-full ml-4" : "right-full mr-4"} -translate-y-1/2 max-w-[150px] ${
                  isLeft ? "text-left" : "text-right"
                } hidden lg:block`}
              >
                <p className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground/80 mb-1">
                  Theme
                </p>
                <p className="font-heading text-lg text-foreground/90 leading-none">
                  {bubble.theme}
                </p>
              </div>
            </div>
          );
        })}
      </div>

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

export default AboutSection;
