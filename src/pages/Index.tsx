import Header from "@/components/Header";
import AboutArchiveSection from "@/components/AboutArchiveSection";
import ContactSection from "@/components/ContactSection";
import ParticipateSection from "@/components/ParticipateSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Analog grain texture */}
      <div className="grain-overlay" />

      {/* Decorative sparkle */}
      <div className="fixed bottom-8 right-8 z-10 opacity-40">
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
            fill="hsl(35, 30%, 90%)"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      <Header />

      {/* 1 & 2. About + Archive — unified scroll-driven section */}
      <AboutArchiveSection />

      {/* 3. Share Your Story */}
      <ParticipateSection />

      {/* 4. Contact */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;
