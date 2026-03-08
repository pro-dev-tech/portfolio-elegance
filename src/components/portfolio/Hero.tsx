import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, User } from "lucide-react";

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
              <Button
                variant="hero"
                size="lg"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Projects
              </Button>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get in Touch
              </Button>
            </div>
          </div>

          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden md:flex items-center justify-center"
          >
            <div className="w-[270px] h-[270px] lg:w-[298px] lg:h-[298px] rounded-2xl overflow-hidden relative group shadow-xl ring-1 ring-border/60">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/30 via-secondary to-accent/15 p-[3px]">
                <div className="w-full h-full rounded-[13px] overflow-hidden bg-secondary">
                  <img
                    src="/images/profile.png"
                    alt="Profile photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none rounded-2xl">
                <div className="text-center">
                  <User size={40} className="mx-auto text-muted-foreground mb-2" />
                  {/* <p className="text-xs text-muted-foreground">Your Photo</p> */}
                </div>
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
