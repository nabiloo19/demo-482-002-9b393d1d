const Footer = ({ variant = "default" }: { variant?: "default" | "exhibit" }) => {
  return (
    <footer className="py-12 px-6 md:px-10 border-t border-border/30">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="font-heading text-lg text-foreground mb-1">
            Yemenis in Exile
          </h3>
          <p className="font-body text-xs text-muted-foreground">
            A digital archive of memories from the Yemeni diaspora
          </p>
        </div>
        <div className="flex gap-8">
          <a
            href="#archive"
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          >
            Archive
          </a>
          <a
            href="#about"
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          >
            About
          </a>
          {variant === "default" && (
            <a
              href="#contact"
              className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Contact
            </a>
          )}
          <a
            href="https://yiepodcast.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-accent hover:text-accent/80 transition-colors uppercase tracking-widest"
          >
            Voices Unfiltered ↗
          </a>
        </div>
        <p className="font-body text-xs text-muted-foreground/60">
          © {new Date().getFullYear()}
        </p>
      </div>
      <div className="max-w-4xl mx-auto mt-6 text-center">
        <a
          href="/references"
          className="font-body text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors uppercase tracking-widest"
        >
          References
        </a>
      </div>
    </footer>
  );
};

export default Footer;