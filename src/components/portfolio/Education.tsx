import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GraduationCap, School } from "lucide-react";

const educationData = [
  {
    icon: GraduationCap,
    level: "College",
    institution: "Your University Name",
    degree: "B.Tech in Computer Science & Engineering",
    duration: "2022 – 2026",
    description: "Relevant coursework: Data Structures, Algorithms, Operating Systems, Database Management, Computer Networks.",
    gpa: "8.5 / 10",
  },
  {
    icon: School,
    level: "School",
    institution: "Your School Name",
    degree: "Higher Secondary (XII) — Science Stream",
    duration: "2020 – 2022",
    description: "Focused on Physics, Chemistry, Mathematics, and Computer Science.",
    gpa: "92%",
  },
];

const Education = () => {
  const [clickCount, setClickCount] = useState(0);
  const lastClickRef = useRef(Date.now());

  const handleHeadingClick = () => {
    const now = Date.now();
    // Reset if more than 2 seconds between clicks
    if (now - lastClickRef.current > 2000) {
      setClickCount(1);
    } else {
      setClickCount((prev) => prev + 1);
    }
    lastClickRef.current = now;

    if (clickCount + 1 >= 7) {
      setClickCount(0);
      window.dispatchEvent(new CustomEvent("adminToggle"));
    }
  };

  return (
    <section id="education" className="section-padding border-t border-border">
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
              <button
                onClick={handleHeadingClick}
                className="text-sm font-semibold text-accent tracking-widest uppercase select-none cursor-default"
              >
                Education
              </button>
            </div>
          </div>
          <div className="space-y-10">
            {educationData.map((edu, i) => (
              <motion.div
                key={edu.level}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative pl-8 border-l-2 border-border hover:border-accent transition-colors duration-300"
              >
                <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                  <edu.icon size={12} className="text-accent" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{edu.institution}</h3>
                    <p className="text-sm text-accent font-medium">{edu.degree}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium shrink-0 mt-1 sm:mt-0">{edu.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{edu.description}</p>
                <p className="text-xs font-medium text-foreground">
                  GPA / Score: <span className="text-accent">{edu.gpa}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
