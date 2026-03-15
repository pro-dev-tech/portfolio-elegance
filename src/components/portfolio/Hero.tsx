import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center section-padding pt-32">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid md:grid-cols-[1fr_auto] gap-12 items-center"
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-2"
            >
              John Doe
            </motion.h2>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-8">
              Engineering Student
            </p>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight mb-8">
              Building elegant
              <br />
              <span className="text-gradient">digital solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
              I craft performant, scalable systems with clean architecture
              and thoughtful design. Passionate about learning and building
              impactful software.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                View Projects
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Get in Touch
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden md:flex items-center justify-center"
          >
            <div className="w-[320px] h-[320px] lg:w-[360px] lg:h-[360px] relative">
              {/* Animated traveling bars */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 200 200"
                fill="none"
              >
              {/* Orange bar */}
                <rect
                  className="animate-travel profile-frame-bar-accent"
                  x="2" y="2" width="196" height="196"
                  rx="13"
                  ry="13"
                  strokeWidth="3"
                  strokeDasharray="92 670"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Blue bar */}
                <rect
                  className="animate-travel profile-frame-bar-contrast"
                  style={{ animationDelay: "-2s" }}
                  x="2" y="2" width="196" height="196"
                  rx="13"
                  ry="13"
                  strokeWidth="3"
                  strokeDasharray="92 670"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-[6px] rounded-2xl overflow-hidden bg-secondary">
                <img
                  src="/images/profile.png"
                  alt="Profile photo"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-20 md:mt-28"
        >
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowDown size={14} className="animate-bounce" />
            Scroll to explore
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
