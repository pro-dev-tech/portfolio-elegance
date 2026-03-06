import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Distributed Task Queue",
    description: "High-throughput task processing system handling 10M+ jobs/day with automatic retries, dead-letter queues, and real-time monitoring.",
    tags: ["Go", "Redis", "gRPC", "Kubernetes"],
    year: "2025",
  },
  {
    title: "Developer CLI Toolkit",
    description: "A composable CLI framework for building internal developer tools with plugin architecture and interactive prompts.",
    tags: ["Rust", "WASM", "TypeScript"],
    year: "2024",
  },
  {
    title: "Real-time Analytics Engine",
    description: "Stream processing pipeline for event analytics with sub-second query latency over billions of events.",
    tags: ["Python", "Apache Kafka", "ClickHouse"],
    year: "2024",
  },
  {
    title: "Infrastructure as Code Platform",
    description: "Declarative infrastructure management tool with drift detection, plan visualization, and multi-cloud support.",
    tags: ["TypeScript", "AWS", "Terraform", "React"],
    year: "2023",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium text-accent tracking-widest uppercase mb-16">Selected Work</p>
        </motion.div>

        <div className="space-y-0">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group border-t border-border py-10 md:py-12 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      size={18}
                      className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                  <p className="text-muted-foreground max-w-xl leading-relaxed text-sm md:text-base">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{project.year}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
