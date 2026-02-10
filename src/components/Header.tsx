import { useState } from "react";
import { Menu } from "lucide-react";
import SlideMenu from "./SlideMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
        <h1 className="font-heading text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          Yemenis in Exile
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-foreground/80 hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          <button className="hidden sm:block px-5 py-2.5 bg-primary text-primary-foreground font-body text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
            Share Your Story
          </button>
        </div>
      </header>
      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
