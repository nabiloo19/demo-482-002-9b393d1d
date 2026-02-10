import Header from "@/components/Header";
import BubbleMap from "@/components/BubbleMap";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-gradient-warm overflow-hidden">
      {/* Analog grain texture */}
      <div className="grain-overlay" />

      {/* Decorative sparkle — bottom right */}
      <div className="fixed bottom-8 right-8 z-10 opacity-50">
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

      <section aria-label="Story themes" className="relative z-10">
        <BubbleMap />
      </section>
    </main>
  );
};

export default Index;
