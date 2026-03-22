import { useMemo } from "react";

/** Small decorative bubbles that float around the About section (non-interactive). */
const decorativeBubbles = [
  { x: 8, y: 15, size: 50, glow: "bubble-glow-amber" },
  { x: 92, y: 20, size: 35, glow: "bubble-glow-rose" },
  { x: 5, y: 55, size: 28, glow: "bubble-glow-gold" },
  { x: 88, y: 65, size: 42, glow: "bubble-glow-amber" },
  { x: 15, y: 82, size: 22, glow: "bubble-glow-rose" },
  { x: 78, y: 85, size: 30, glow: "bubble-glow-gold" },
  { x: 3, y: 35, size: 18, glow: "bubble-glow-amber" },
  { x: 95, y: 42, size: 24, glow: "bubble-glow-rose" },
  { x: 12, y: 92, size: 16, glow: "bubble-glow-gold" },
  { x: 85, y: 10, size: 20, glow: "bubble-glow-amber" },
];

const AboutSection = () => {
  const bubbles = useMemo(() => decorativeBubbles, []);

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 px-6 md:px-10 overflow-hidden min-h-screen flex items-center"
    >
      {/* Decorative non-interactive bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${b.glow} bubble-decorative`}
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animation: `float ${7 + (i % 4)}s ease-in-out ${(i * 0.9).toFixed(1)}s infinite`,
          }}
        />
      ))}

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
