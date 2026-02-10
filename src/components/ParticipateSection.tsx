const ParticipateSection = () => {
  return (
    <section
      id="participate"
      className="relative py-24 md:py-32 px-6 md:px-10 bg-card/60"
    >
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
          Join the Archive
        </p>
        <h2 className="font-heading text-3xl md:text-5xl text-foreground mb-6 leading-tight">
          Share Your
          <br />
          <span className="italic text-accent">Story</span>
        </h2>
        <p className="font-body text-base text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
          Every memory matters. Whether it's the scent of your mother's kitchen,
          the games you played as a child, or the moment you left — your story
          is part of our collective history.
        </p>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-soft max-w-md mx-auto text-left space-y-5">
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Your Name
            </label>
            <input
              type="text"
              placeholder="How should we call you?"
              className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
            />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
            />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Your Memory
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about a moment, a ritual, a place you remember..."
              className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition resize-none"
            />
          </div>
          <button className="w-full px-5 py-3.5 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors mt-2">
            Submit Your Story
          </button>
        </div>
      </div>
    </section>
  );
};

export default ParticipateSection;
