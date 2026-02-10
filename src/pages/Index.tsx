import Header from "@/components/Header";
import BubbleMap from "@/components/BubbleMap";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import ParticipateSection from "@/components/ParticipateSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Analog grain texture */}
      <div className="grain-overlay" />

      {/* Decorative sparkle — bottom right of hero */}
      <div className="absolute bottom-8 right-8 z-10 opacity-50" style={{ top: "calc(100vh - 60px)" }}>
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M18 0L20.5 15.5L36 18L20.5 20.5L18 36L15.5 20.5L0 18L15.5 15.5L18 0Z"
            fill="hsl(38, 55%, 94%)"
            fillOpacity="0.7"
          />
        </svg>
      </div>

      <Header />

      {/* Hero / Archive section */}
      <section id="archive" className="relative bg-gradient-warm py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-2">
            The Archive
          </h2>
          <p className="font-body text-muted-foreground text-center max-w-xl mx-auto mb-8">
            Explore the most common themes shared by Yemenis in exile. Click a bubble to hear their stories.
          </p>
        </div>
        <BubbleMap />
      </section>

      {/* About */}
      <AboutSection />

      {/* Contact */}
      <ContactSection />

      {/* Participate */}
      <ParticipateSection />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;
