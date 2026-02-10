import { useState, useMemo } from "react";
import { themes, type ThemeBubble } from "@/data/themes";
import { useIsMobile } from "@/hooks/use-mobile";
import StoryOverlay from "./StoryOverlay";

const BubbleMap = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeBubble | null>(null);
  const isMobile = useIsMobile();

  const maxFrequency = useMemo(
    () => Math.max(...themes.map((t) => t.frequency)),
    []
  );

  const getBubbleSize = (frequency: number) => {
    const minSize = isMobile ? 16 : 28;
    const maxSize = isMobile ? 105 : 200;
    return minSize + (frequency / maxFrequency) * (maxSize - minSize);
  };

  const getColorClass = (variant: string) => {
    switch (variant) {
      case "blush":
        return "bg-bubble-blush";
      case "cream":
        return "bg-bubble-cream";
      case "sand":
        return "bg-bubble-sand";
      default:
        return "bg-bubble-cream";
    }
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-6xl h-[80vh] mx-4">
            {themes.map((bubble, index) => {
              const size = getBubbleSize(bubble.frequency);
              const isClickable = bubble.theme !== "";

              return (
                <div
                  key={bubble.id}
                  className="absolute"
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <button
                    disabled={!isClickable}
                    onClick={() => isClickable && setSelectedTheme(bubble)}
                    className={`rounded-full ${getColorClass(
                      bubble.colorVariant
                    )} flex items-center justify-center shadow-sm ${
                      isClickable
                        ? "cursor-pointer bubble-hover"
                        : "cursor-default opacity-70"
                    }`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      animation: `float ${
                        6 + (bubble.frequency % 5)
                      }s ease-in-out ${((index * 0.73) % 5).toFixed(2)}s infinite`,
                    }}
                  >
                    {bubble.theme && size > 45 && (
                      <span
                        className={`font-heading text-foreground select-none pointer-events-none leading-tight text-center px-2 ${
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
        </div>
      </div>

      <StoryOverlay
        theme={selectedTheme}
        onClose={() => setSelectedTheme(null)}
      />
    </>
  );
};

export default BubbleMap;
