import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ImageIcon, X } from "lucide-react";

const achievementsData = [
  {
    title: "Hackathon Winner",
    description: "Won first place at XYZ National Hackathon 2025 among 500+ teams.",
    details: "Led a team of 4 to build an AI-powered accessibility tool in 36 hours. The solution utilized computer vision and NLP to assist visually impaired users. Competed against 500+ teams from across the country.",
    image: "/placeholder.svg",
    date: "March 2025",
  },
  {
    title: "Research Paper Published",
    description: "Published a paper on ML-based optimization in IEEE conference proceedings.",
    details: "Co-authored a research paper titled 'Optimizing Neural Network Inference Using Adaptive Pruning Strategies' published in IEEE International Conference. The paper proposed a novel pruning algorithm that reduced model size by 40% with minimal accuracy loss.",
    image: "/placeholder.svg",
    date: "January 2025",
  },
  {
    title: "Open Source Contributor",
    description: "Top contributor to a popular open-source project with 1000+ stars on GitHub.",
    details: "Contributed 50+ pull requests to a widely-used open-source developer toolkit. Implemented key features including a plugin system and CLI improvements. The project has over 1000 stars on GitHub.",
    image: "/placeholder.svg",
    date: "2024",
  },
];

const Achievements = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items for seamless loop
  const duplicatedItems = [...achievementsData, ...achievementsData];

  return (
    <section id="achievements" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20 mb-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-accent" />
                <p className="text-sm font-semibold text-accent tracking-widest uppercase">
                  Achievements
                </p>
              </div>
            </div>
            <div />
          </div>

          {/* Marquee container */}
          <div
            className="overflow-hidden relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
              ref={scrollRef}
            >
              {duplicatedItems.map((achievement, i) => (
                <div
                  key={`${achievement.title}-${i}`}
                  onClick={() => setExpandedIndex(i % achievementsData.length)}
                  className="flex-shrink-0 w-[500px] sm:w-[560px] cursor-pointer group"
                >
                  <div className="flex rounded-xl border border-border bg-card overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all duration-300 h-[160px]">
                    {/* Image left */}
                    <div className="relative w-[160px] h-full bg-secondary overflow-hidden flex-shrink-0">
                      <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary/70 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                        <ImageIcon size={20} className="text-muted-foreground" />
                      </div>
                    </div>
                    {/* Content right */}
                    <div className="p-5 flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy size={14} className="text-accent shrink-0" />
                        <h3 className="font-display text-sm font-semibold text-foreground truncate">
                          {achievement.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                        {achievement.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {achievement.date}
                      </p>
                      <p className="text-[10px] text-accent mt-2 font-medium">Click to expand →</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Expanded detail modal */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
            onClick={() => setExpandedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] bg-secondary overflow-hidden">
                <img
                  src={achievementsData[expandedIndex].image}
                  alt={achievementsData[expandedIndex].title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setExpandedIndex(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy size={16} className="text-accent" />
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    {achievementsData[expandedIndex].date}
                  </p>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  {achievementsData[expandedIndex].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {achievementsData[expandedIndex].details}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Achievements;
