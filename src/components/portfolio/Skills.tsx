import { motion } from "framer-motion";

const skillGroups = [
  {
    category: "Languages",
    skills: ["TypeScript", "Go", "Rust", "Python", "SQL"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "gRPC", "GraphQL", "REST", "Microservices"],
  },
  {
    category: "Infrastructure",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
  },
  {
    category: "Data",
    skills: ["PostgreSQL", "Redis", "Kafka", "ClickHouse", "MongoDB"],
  },
];

const Skills = () => {
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
            <p className="text-sm font-medium text-accent tracking-widest uppercase">Expertise</p>
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
                    <p key={skill} className="text-muted-foreground text-sm">
                      {skill}
                    </p>
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

export default Skills;
