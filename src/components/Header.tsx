import { useState, useCallback, useEffect } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import SlideMenu from "./SlideMenu";

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleShare = useCallback(() => {
    scrollToSection("participate");
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
        <button
          onClick={() => scrollToSection("about")}
          className="font-heading text-xl md:text-2xl font-semibold text-foreground tracking-tight hover:opacity-80 transition-opacity"
        >
          Yemenis in Exile
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-foreground/80 hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={handleShare}
            className="hidden sm:block px-5 py-2.5 bg-primary text-primary-foreground font-body text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Share Your Story
          </button>
        </div>
      </header>
      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
