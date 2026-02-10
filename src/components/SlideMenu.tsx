import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "The Archive", href: "#archive" },
  { label: "About the Project", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Participate", href: "#participate" },
];

const SlideMenu = ({ isOpen, onClose }: SlideMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-card/95 backdrop-blur-md flex flex-col"
            style={{
              boxShadow: "-20px 0 60px -10px hsl(20, 30%, 15%, 0.15)",
            }}
          >
            <div className="flex justify-end p-6">
              <button
                onClick={onClose}
                className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-col gap-1 px-10 py-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={onClose}
                  className="font-heading text-2xl md:text-3xl text-foreground/80 hover:text-foreground transition-colors py-4 border-b border-border/30"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <div className="mt-auto px-10 py-8">
              <button className="w-full px-5 py-3.5 bg-primary text-primary-foreground font-body text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                Share Your Story
              </button>
              <p className="mt-4 font-body text-xs text-muted-foreground text-center leading-relaxed">
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
