import { useState, useCallback } from "react";
import { Menu } from "lucide-react";
import SlideMenu from "./SlideMenu";

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShare = useCallback(() => {
    scrollToSection("participate");
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
        <button
          onClick={() => scrollToSection("archive")}
          className="font-heading text-xl md:text-2xl font-semibold text-foreground tracking-tight hover:opacity-80 transition-opacity"
        >
          Yemenis in Exile
        </button>
        <div className="flex items-center gap-4">
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
