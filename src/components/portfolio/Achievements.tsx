import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { useScrollLock } from "@/hooks/use-scroll-lock";

const achievementsData = [
  {
    title: "Research Paper Published",
    description: "Published a paper on ML-based optimization in IEEE conference proceedings.",
    details: "Co-authored a research paper titled 'Optimizing Neural Network Inference Using Adaptive Pruning Strategies' published in IEEE International Conference. The paper proposed a novel pruning algorithm that reduced model size by 40% with minimal accuracy loss.",
    image: "/images/ach2.jpg",
    date: "January 2025",
  },
  {
    title: "Hackathon Winner",
    description: "Won first place at XYZ National Hackathon 2025 among 500+ teams.",
    details: "Led a team of 4 to build an AI-powered accessibility tool in 36 hours. The solution utilized computer vision and NLP to assist visually impaired users. Competed against 500+ teams from across the country.",
    image: "/images/ach1.jpg",
    date: "March 2025",
  },
  {
    title: "Open Source Contributor",
    description: "Top contributor to a popular open-source project with 1000+ stars on GitHub.",
    details: "Contributed 50+ pull requests to a widely-used open-source developer toolkit. Implemented key features including a plugin system and CLI improvements. The project has over 1000 stars on GitHub.",
    image: "/images/ach3.jpg",
    date: "2024",
  },
];

const CARD_WIDTH = 540;
const GAP = 24;
const ITEM_TOTAL = CARD_WIDTH + GAP;
const SPEED = 70;

// Compute button order so activeIndex is always in the center
const getButtonOrder = (activeIdx: number, total: number): number[] => {
  const center = Math.floor(total / 2);
  const order: number[] = [];
  for (let i = 0; i < total; i++) {
    order.push(((activeIdx - center + i) % total + total) % total);
  }
  return order;
};

const Achievements = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalWidth = achievementsData.length * ITEM_TOTAL;

  useScrollLock(expandedIndex !== null);

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (!isPausedRef.current) {
      setOffset((prev) => {
        const next = prev + (SPEED * delta) / 1000;
        return next >= totalWidth ? next - totalWidth : next;
      });
    }
    animRef.current = requestAnimationFrame(animate);
  }, [totalWidth]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const center = offset + containerWidth / 2;
    const idx =
      Math.floor(
        (((center % totalWidth) + totalWidth) % totalWidth) / ITEM_TOTAL
      ) % achievementsData.length;
    setActiveIndex(idx);
  }, [offset, totalWidth]);

  const renderCards = () => {
    const items: { achievement: (typeof achievementsData)[0]; origIndex: number; position: number }[] = [];
    for (let set = -1; set <= 2; set++) {
      achievementsData.forEach((a, i) => {
        items.push({
          achievement: a,
          origIndex: i,
          position: set * totalWidth + i * ITEM_TOTAL - offset,
        });
      });
    }
    return items;
  };

  const buttonOrder = getButtonOrder(activeIndex, achievementsData.length);

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
        </motion.div>

        {/* Marquee */}
        <div
          ref={containerRef}
          className="overflow-hidden relative h-[170px]"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
        >
          {renderCards().map(({ achievement, origIndex, position }, i) => (
            <div
              key={`${achievement.title}-${i}`}
              className="absolute top-0 cursor-pointer group"
              style={{
                transform: `translateX(${position}px)`,
                width: `${CARD_WIDTH}px`,
                willChange: "transform",
              }}
              onClick={() => setExpandedIndex(origIndex)}
            >
              <div className="flex rounded-xl border border-border bg-card overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all duration-300 h-[160px]">
                <div className="relative w-[140px] h-full bg-secondary overflow-hidden flex-shrink-0">
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
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
        </div>

        {/* Rotating indicator buttons */}
        <div className="mt-6 flex justify-center">
          <LayoutGroup>
            <div className="flex gap-3">
              {buttonOrder.map((idx) => (
                <motion.button
                  key={achievementsData[idx].title}
                  layout
                  transition={{ type: "spring", stiffness: 250, damping: 28 }}
                  onClick={() => setExpandedIndex(idx)}
                  className={`
                    text-xs px-4 py-2 rounded-full border font-medium transition-colors duration-300 whitespace-nowrap
                    ${activeIndex === idx
                      ? "border-accent bg-accent/15 text-accent shadow-[0_0_14px_hsl(var(--accent)/0.4)]"
                      : "border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-foreground"
                    }
                  `}
                >
                  {achievementsData[idx].title}
                </motion.button>
              ))}
            </div>
          </LayoutGroup>
        </div>
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
              className="bg-card border-2 border-accent/30 shadow-[0_0_30px_hsl(var(--accent)/0.12)] rounded-2xl max-w-2xl w-full overflow-hidden max-h-[85vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-accent" />
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                      {achievementsData[expandedIndex].date}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedIndex(null)}
                    className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="relative bg-secondary overflow-hidden rounded-xl mb-6 max-h-[200px] flex items-center justify-center">
                  <img
                    src={achievementsData[expandedIndex].image}
                    alt={achievementsData[expandedIndex].title}
                    loading="lazy"
                    className="max-w-full max-h-[200px] object-contain mx-auto"
                  />
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
