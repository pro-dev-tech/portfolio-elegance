import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const experienceData = [
  {
    role: "Software Engineering Intern",
    company: "Your Company Name",
    duration: "Jun 2025 – Aug 2025",
    description:
      "Developed REST APIs, optimized database queries, and contributed to CI/CD pipelines. Collaborated with cross-functional teams on product features.",
    technologies: ["React", "Node.js", "PostgreSQL"],
  },
  {
    role: "Web Development Intern",
    company: "Another Company",
    duration: "Jan 2025 – Mar 2025",
    description:
      "Built responsive front-end interfaces and integrated third-party APIs. Improved page load performance by 30%.",
    technologies: ["TypeScript", "Tailwind CSS", "REST APIs"],
  },
];

const Experience = () => {
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
            <p className="text-sm font-medium text-accent tracking-widest uppercase">
              Experience
            </p>
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
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {exp.role}
                    </h3>
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
    </section>
  );
};

export default Experience;
