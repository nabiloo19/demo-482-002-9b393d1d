const AboutSection = () => {
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
            of the Yemeni diaspora. The rituals preserved in kitchens abroad,
            the lullabies hummed in unfamiliar rooms, the textures of a homeland
            felt across oceans.
          </p>
          <p>
            Through audio recordings, moving images, and written testimonies,
            this archive becomes a living document of displacement, resilience,
            and the quiet acts of belonging that define a people in exile.
          </p>
          <p>
            Each bubble on the map represents a recurring theme in the archive,
            a thread connecting individual memories into a collective tapestry.
            The larger the bubble, the more stories it holds.
          </p>
          <p>
            Tap a bubble to hear a short memory tied to its theme. When you've
            heard them all, hit the refresh button below the map and the bubbles
            retract, then re-emerge carrying a new set of memories from the archive.
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-border/30">
          <blockquote className="font-heading italic text-xl md:text-2xl text-foreground/80 max-w-xl mx-auto">
            "We did not leave home. We carried it with us, in the way we brew
            our coffee, in the songs we sing to our children."
          </blockquote>
          <p className="mt-4 font-body text-xs uppercase tracking-widest text-muted-foreground">
            From the Archive
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;