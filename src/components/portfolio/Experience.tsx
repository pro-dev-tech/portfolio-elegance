import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, X } from "lucide-react";

const experienceData = [
  {
    role: "Software Engineering Intern",
    company: "Your Company Name",
    duration: "Jun 2025 – Aug 2025",
    description:
      "Developed REST APIs, optimized database queries, and contributed to CI/CD pipelines. Collaborated with cross-functional teams on product features.",
    technologies: ["React", "Node.js", "PostgreSQL"],
    detailedJourney: "During my internship, I was part of the platform engineering team where I designed and implemented 5 new REST API endpoints serving 10K+ daily requests. I optimized critical database queries reducing response times by 60%. I also set up automated CI/CD pipelines using GitHub Actions that reduced deployment time from 30 minutes to 5 minutes. Collaborated with product managers, designers, and senior engineers in an agile environment with daily standups and bi-weekly sprints.",
  },
  {
    role: "Web Development Intern",
    company: "Another Company",
    duration: "Jan 2025 – Mar 2025",
    description:
      "Built responsive front-end interfaces and integrated third-party APIs. Improved page load performance by 30%.",
    technologies: ["TypeScript", "Tailwind CSS", "REST APIs"],
    detailedJourney: "Worked on the customer-facing web application, rebuilding key pages with modern React patterns and TypeScript. Implemented lazy loading, code splitting, and image optimization that improved Lighthouse performance scores from 65 to 95. Integrated payment gateway and analytics APIs. Mentored by senior developers and participated in code reviews that significantly improved my coding practices.",
  },
];

const Experience = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-accent" />
              <p className="text-sm font-semibold text-accent tracking-widest uppercase">
                Experience
              </p>
            </div>
          </div>
          <div className="space-y-10">
            {experienceData.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative pl-8 border-l-2 border-border hover:border-accent transition-colors duration-300"
              >
                <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                  <Briefcase size={12} className="text-accent" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <button
                      onClick={() => setExpandedIndex(i)}
                      className="font-display text-lg font-semibold text-foreground hover:text-accent transition-colors cursor-pointer text-left group"
                    >
                      <span className="relative">
                        {exp.role}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
                      </span>
                    </button>
                    <p className="text-sm text-accent font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium shrink-0 mt-1 sm:mt-0">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Expanded Experience Detail */}
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
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase size={16} className="text-accent" />
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {experienceData[expandedIndex].duration}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {experienceData[expandedIndex].role}
                    </h3>
                    <p className="text-accent font-medium mt-1">
                      {experienceData[expandedIndex].company}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedIndex(null)}
                    className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <h4 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Detailed Journey
                </h4>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {experienceData[expandedIndex].detailedJourney}
                </p>

                <div className="flex flex-wrap gap-2">
                  {experienceData[expandedIndex].technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Experience;
