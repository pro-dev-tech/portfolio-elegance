import { motion } from "framer-motion";
import { Trophy, ImageIcon } from "lucide-react";

const achievementsData = [
  {
    title: "Hackathon Winner",
    description: "Won first place at XYZ National Hackathon 2025 among 500+ teams.",
    image: "/placeholder.svg",
    date: "March 2025",
  },
  {
    title: "Research Paper Published",
    description: "Published a paper on ML-based optimization in IEEE conference proceedings.",
    image: "/placeholder.svg",
    date: "January 2025",
  },
  {
    title: "Open Source Contributor",
    description: "Top contributor to a popular open-source project with 1000+ stars on GitHub.",
    image: "/placeholder.svg",
    date: "2024",
  },
];

const Achievements = () => {
  return (
    <section id="achievements" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <p className="text-sm font-medium text-accent tracking-widest uppercase">
              Achievements
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievementsData.map((achievement, i) => (
              <motion.div
                key={`${achievement.title}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all duration-300"
              >
                {/* Image placeholder */}
                <div className="relative aspect-[16/10] bg-secondary overflow-hidden">
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/70 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                    <div className="text-center">
                      <ImageIcon size={24} className="mx-auto text-muted-foreground mb-1" />
                      <p className="text-[10px] text-muted-foreground">Achievement Photo</p>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={14} className="text-accent shrink-0" />
                    <h3 className="font-display text-sm font-semibold text-foreground truncate">
                      {achievement.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {achievement.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {achievement.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
