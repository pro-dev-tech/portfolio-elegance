import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollLock } from "@/hooks/use-scroll-lock";

const skillGroups = [
  {
    category: "Languages",
    skills: [
      { name: "TypeScript", certificate: "/placeholder.svg", journey: "Started learning TypeScript in 2022. Built multiple full-stack projects and contributed to open-source TypeScript libraries. Proficient in advanced types, generics, and utility types." },
      { name: "Go", certificate: "/placeholder.svg", journey: "Picked up Go for building high-performance microservices. Developed REST APIs and gRPC services handling thousands of requests per second." },
      { name: "Rust", certificate: "/placeholder.svg", journey: "Exploring Rust for systems programming and WebAssembly. Built CLI tools and contributed to community crates." },
      { name: "Python", certificate: "/placeholder.svg", journey: "Used Python extensively for data analysis, ML projects, and automation scripts. Comfortable with Django, FastAPI, and scientific computing libraries." },
      { name: "SQL", certificate: "/placeholder.svg", journey: "Deep knowledge of SQL for complex queries, database optimization, and schema design across PostgreSQL and MySQL." },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", certificate: "/placeholder.svg", journey: "Built production-grade APIs and microservices with Express and Fastify. Experience with event-driven architecture and worker threads." },
      { name: "gRPC", certificate: "/placeholder.svg", journey: "Implemented inter-service communication using gRPC with Protocol Buffers for high-performance distributed systems." },
      { name: "GraphQL", certificate: "/placeholder.svg", journey: "Designed and built GraphQL APIs with Apollo Server. Implemented efficient resolvers, dataloaders, and schema stitching." },
      { name: "REST", certificate: "/placeholder.svg", journey: "Extensive experience designing RESTful APIs following best practices for versioning, authentication, and error handling." },
      { name: "Microservices", certificate: "/placeholder.svg", journey: "Architected microservices with event-driven patterns, saga orchestration, and service mesh integration." },
    ],
  },
  {
    category: "Infrastructure",
    skills: [
      { name: "AWS", certificate: "/placeholder.svg", journey: "Hands-on experience with EC2, Lambda, S3, DynamoDB, SQS, and CloudFormation. AWS Certified Cloud Practitioner." },
      { name: "Kubernetes", certificate: "/placeholder.svg", journey: "Deployed and managed containerized applications on K8s clusters. Experience with Helm charts, Ingress controllers, and monitoring." },
      { name: "Docker", certificate: "/placeholder.svg", journey: "Containerized applications with multi-stage builds, optimized images, and Docker Compose for local development." },
      { name: "Terraform", certificate: "/placeholder.svg", journey: "Infrastructure as Code using Terraform for provisioning cloud resources across AWS and GCP." },
      { name: "CI/CD", certificate: "/placeholder.svg", journey: "Set up automated pipelines with GitHub Actions, GitLab CI, and Jenkins for testing, building, and deploying applications." },
    ],
  },
  {
    category: "Data",
    skills: [
      { name: "PostgreSQL", certificate: "/placeholder.svg", journey: "Advanced query optimization, partitioning, indexing strategies, and replication setup for high-availability databases." },
      { name: "Redis", certificate: "/placeholder.svg", journey: "Used Redis for caching, session management, pub/sub messaging, and rate limiting in production systems." },
      { name: "Kafka", certificate: "/placeholder.svg", journey: "Implemented event streaming with Kafka for real-time data pipelines and async communication between services." },
      { name: "ClickHouse", certificate: "/placeholder.svg", journey: "Built analytics dashboards powered by ClickHouse for processing billions of events with sub-second query times." },
      { name: "MongoDB", certificate: "/placeholder.svg", journey: "Used MongoDB for flexible document storage, aggregation pipelines, and geospatial queries." },
    ],
  },
];

const Skills = () => {
  const [expandedSkill, setExpandedSkill] = useState<{ category: string; skill: typeof skillGroups[0]["skills"][0] } | null>(null);
  const [showResume, setShowResume] = useState(false);
  useScrollLock(expandedSkill !== null || showResume);

  return (
    <section id="skills" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-accent" />
              <p className="text-sm font-semibold text-accent tracking-widest uppercase">Expertise</p>
            </div>
            <Button
              variant="hero-outline"
              size="lg"
              onClick={() => setShowResume(true)}
              className="mt-2"
            >
              <FileText size={16} />
              View My Resume
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-10">
            {skillGroups.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <h3 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                  {group.category}
                </h3>
                <div className="space-y-2">
                  {group.skills.map((skill) => (
                    <button
                      key={skill.name}
                      onClick={() => setExpandedSkill({ category: group.category, skill })}
                      className="block text-muted-foreground text-sm hover:text-accent transition-colors cursor-pointer text-left group"
                    >
                      <span className="relative">
                        {skill.name}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Expanded Skill Card */}
      <AnimatePresence>
        {expandedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
            onClick={() => setExpandedSkill(null)}
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
                    <p className="text-[11px] text-accent font-semibold uppercase tracking-wider mb-1">
                      {expandedSkill.category}
                    </p>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {expandedSkill.skill.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setExpandedSkill(null)}
                    className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="relative bg-secondary overflow-hidden rounded-xl mb-6 max-h-[200px] flex items-center justify-center">
                  <img
                    src={expandedSkill.skill.certificate}
                    alt={`${expandedSkill.skill.name} certificate`}
                    loading="lazy"
                    className="max-w-full max-h-[200px] object-contain mx-auto"
                  />
                </div>

                <h4 className="font-display text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Learning Journey
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {expandedSkill.skill.journey}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Modal - shows actual PDF */}
      <AnimatePresence>
        {showResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
            onClick={() => setShowResume(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-card border-2 border-accent/30 shadow-[0_0_30px_hsl(var(--accent)/0.12)] rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-display text-xl font-bold text-foreground">My Resume</h3>
                <button
                  onClick={() => setShowResume(false)}
                  className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <iframe
                  src="/resume.pdf"
                  title="Resume"
                  className="w-full h-full rounded-lg border border-border"
                  style={{ minHeight: "60vh" }}
                />
              </div>
              <div className="p-4 border-t border-border">
                <a href="/resume.pdf" download="John_Doe_Resume.pdf" className="w-full block">
                  <Button variant="hero" size="lg" className="w-full">
                    <Download size={16} />
                    Download Resume
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

export default Skills;
