import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollLock } from "@/hooks/use-scroll-lock";

const projects = [
  {
    title: "Distributed Task Queue",
    description: "High-throughput task processing system handling 10M+ jobs/day with automatic retries, dead-letter queues, and real-time monitoring.",
    details: "Built a distributed task queue system capable of processing over 10 million jobs per day. The architecture features automatic retries with exponential backoff, dead-letter queues for failed tasks, and a real-time monitoring dashboard. Implemented using Go for the core engine, Redis for queue management, gRPC for inter-service communication, and deployed on Kubernetes for horizontal scaling.",
    tags: ["Go", "Redis", "gRPC", "Kubernetes"],
    year: "2025",
    image: "/images/intern1.jpg",
    link: "https://123.vercel.app",
  },
  {
    title: "Developer CLI Toolkit",
    description: "A composable CLI framework for building internal developer tools with plugin architecture and interactive prompts.",
    details: "Designed and developed a composable CLI framework that enables teams to build internal developer tools rapidly. Features a plugin architecture for extensibility, interactive terminal prompts, auto-generated help documentation, and WebAssembly support for cross-platform distribution.",
    tags: ["Rust", "WASM", "TypeScript"],
    year: "2024",
    image: "/images/intern2.jpg",
    link: "https://567.vercel.app",
  },
  {
    title: "Real-time Analytics Engine",
    description: "Stream processing pipeline for event analytics with sub-second query latency over billions of events.",
    details: "Architected a real-time analytics engine processing billions of events with sub-second query latency. The pipeline ingests events via Apache Kafka, processes them through a Python-based stream processor, and stores results in ClickHouse for fast analytical queries.",
    tags: ["Python", "Apache Kafka", "ClickHouse"],
    year: "2024",
    image: "/images/intern3.jpg",
    link: "https://785.vercel.app",
  },
  {
    title: "Infrastructure as Code Platform",
    description: "Declarative infrastructure management tool with drift detection, plan visualization, and multi-cloud support.",
    details: "Created a declarative infrastructure management platform supporting AWS, GCP, and Azure. Features include automatic drift detection, visual plan previews before applying changes, rollback capabilities, and a React-based dashboard.",
    tags: ["TypeScript", "AWS", "Terraform", "React"],
    year: "2023",
    image: "/images/intern4.jpg",
    link: "https://888.streamlit.app",
  },
];

const Projects = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  useScrollLock(expandedIndex !== null);

  return (
    <section id="projects" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-[2px] bg-accent" />
            <p className="text-sm font-semibold text-accent tracking-widest uppercase">Selected Work</p>
          </div>
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
              onClick={() => setExpandedIndex(i)}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-muted-foreground max-w-xl leading-relaxed text-sm md:text-base">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{project.year}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
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
                  <div>
                    <p className="text-[11px] text-accent font-semibold uppercase tracking-wider mb-2">{projects[expandedIndex].year}</p>
                    <h3 className="font-display text-2xl font-bold text-foreground">{projects[expandedIndex].title}</h3>
                  </div>
                  <button onClick={() => setExpandedIndex(null)} className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Centered image */}
                <div className="bg-secondary overflow-hidden rounded-xl mb-6 max-h-[200px] flex items-center justify-center">
                  <img
                    src={projects[expandedIndex].image}
                    alt={projects[expandedIndex].title}
                    loading="lazy"
                    className="max-w-full max-h-[200px] object-contain mx-auto"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {projects[expandedIndex].tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{tag}</span>
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{projects[expandedIndex].details}</p>
                <a href={projects[expandedIndex].link} target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" size="lg">
                    <ExternalLink size={16} />
                    View Work
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
