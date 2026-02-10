import { Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 px-6 md:px-10"
    >
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
          Get in Touch
        </p>
        <h2 className="font-heading text-3xl md:text-5xl text-foreground mb-6">
          Contact
        </h2>
        <p className="font-body text-base text-muted-foreground leading-relaxed mb-12 max-w-md mx-auto">
          For collaborations, press inquiries, or to learn more about the
          project, we'd love to hear from you.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <a
            href="mailto:hello@yemenisinexile.org"
            className="flex items-center gap-3 font-body text-foreground hover:text-accent transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <Mail size={18} className="text-foreground/70" />
            </div>
            <span className="text-sm">hello@yemenisinexile.org</span>
          </a>
          <div className="flex items-center gap-3 font-body text-foreground/70">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <MapPin size={18} className="text-foreground/70" />
            </div>
            <span className="text-sm">The Diaspora, Worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
