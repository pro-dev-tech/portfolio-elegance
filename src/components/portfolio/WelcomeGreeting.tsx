import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const GREETING_KEY = "portfolio_greeting_shown";
const GREETING_COOLDOWN = 1000 * 60 * 60 * 24; // 24 hours

const WelcomeGreeting = () => {
  const [phase, setPhase] = useState<"idle" | "dropping" | "visible" | "rising">("idle");

  useEffect(() => {
    const lastShown = localStorage.getItem(GREETING_KEY);
    const now = Date.now();

    if (lastShown && now - parseInt(lastShown) < GREETING_COOLDOWN) {
      return; // Don't show again within cooldown
    }

    // Start animation after a short delay
    const startTimer = setTimeout(() => {
      setPhase("dropping");
      localStorage.setItem(GREETING_KEY, now.toString());
    }, 1200);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (phase === "dropping") {
      const timer = setTimeout(() => setPhase("visible"), 600);
      return () => clearTimeout(timer);
    }
    if (phase === "visible") {
      const timer = setTimeout(() => setPhase("rising"), 4000);
      return () => clearTimeout(timer);
    }
    if (phase === "rising") {
      const timer = setTimeout(() => setPhase("idle"), 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === "idle") return null;

  // Position: below the theme toggle in header (top-right area)
  return (
    <div className="fixed top-0 right-0 z-[60] pointer-events-none" style={{ width: "420px" }}>
      <AnimatePresence>
        {(phase === "dropping" || phase === "visible" || phase === "rising") && (
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.3, originX: 1, originY: 0 }}
            animate={
              phase === "rising"
                ? { y: -20, opacity: 0, scale: 0.3 }
                : { y: 70, opacity: 1, scale: 1 }
            }
            exit={{ y: -20, opacity: 0, scale: 0.3 }}
            transition={
              phase === "rising"
                ? { duration: 0.6, ease: "easeIn" }
                : { type: "spring", stiffness: 200, damping: 20 }
            }
            className="mr-4 pointer-events-auto"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 relative overflow-hidden">
              {/* Decorative accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" />
              
              {/* Small triangle pointing up-right toward the icon */}
              <div className="absolute -top-2 right-12 w-4 h-4 bg-card border-l border-t border-border rotate-45" />

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={16} className="text-accent" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm mb-1">
                    Hello! Welcome to my site!
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Good to see you here. Let's start exploring!!!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeGreeting;
