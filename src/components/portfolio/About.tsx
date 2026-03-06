import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <p className="text-sm font-medium text-accent tracking-widest uppercase">About</p>
          </div>
          <div className="space-y-6">
            <p className="text-xl md:text-2xl font-display leading-relaxed text-foreground">
              I'm a software engineer with 6+ years of experience designing and
              building systems that scale. I specialize in backend architecture,
              cloud infrastructure, and crafting developer experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Previously at companies like Stripe and Vercel, I've shipped products
              used by millions. I believe in writing code that's as readable as it is
              performant — and in the power of good abstractions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I'm not coding, you'll find me contributing to open-source projects,
              writing technical articles, or exploring new programming languages.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-border">
              {[
                { label: "Years Experience", value: "6+" },
                { label: "Projects Shipped", value: "40+" },
                { label: "Open Source Contributions", value: "120+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
