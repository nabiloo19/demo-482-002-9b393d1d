import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "About the Project", id: "about" },
  { label: "The Archive", id: "archive" },
  { label: "Share Your Story", id: "participate" },
  { label: "Contact", id: "contact" },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const SlideMenu = ({ isOpen, onClose }: SlideMenuProps) => {
  const handleNavClick = (id: string) => {
    onClose();
    setTimeout(() => scrollToSection(id), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-card backdrop-blur-md flex flex-col"
            style={{
              boxShadow: "-20px 0 60px -10px hsl(0, 0%, 0%, 0.3)",
            }}
          >
            <div className="flex justify-end p-6">
              <button
                onClick={onClose}
                className="p-2 text-card-foreground/70 hover:text-card-foreground transition-colors"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-col gap-1 px-10 py-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={() => handleNavClick(link.id)}
                  className="font-heading text-2xl md:text-3xl text-card-foreground/80 hover:text-card-foreground transition-colors py-4 border-b border-sidebar-border/30 text-left"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.07 }}
                href="https://yiepodcast.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-2xl md:text-3xl text-accent/80 hover:text-accent transition-colors py-4 border-b border-sidebar-border/30 text-left"
              >
                Voices Unfiltered ↗
              </motion.a>
            </div>

            <div className="mt-auto px-10 py-8">
              <button
                onClick={() => handleNavClick("participate")}
                className="w-full px-5 py-3.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
              >
                Share Your Story
              </button>
              <p className="mt-4 font-body text-xs text-card-foreground/50 text-center leading-relaxed">
                Every memory matters.
                <br />
                Share yours with the archive.
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideMenu;