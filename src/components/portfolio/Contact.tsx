import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Github, Linkedin, Phone, Send, MessageCircle, Code2, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-700",
      });
      return;
    }

    setSending(true);

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          from_name: form.name,
          reply_to: form.email,
          message: form.message,
        },
        "YOUR_PUBLIC_KEY"
      );

      toast({
        title: "Message sent!",
        description: "I'll get back to you soon.",
        className: "bg-green-600 text-white border-green-700",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-700",
      });
    } finally {
      setSending(false);
    }
  };

  const whatsappNumber = "911234567890";
  const whatsappMessage = encodeURIComponent(
    "Hello Man! I'm reaching you regarding your portfolio. I'd like to discuss a potential opportunity."
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="contact" className="section-padding border-t border-border">
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
              <p className="text-sm font-semibold text-accent tracking-widest uppercase">Contact</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Let's work together
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              I'm always interested in hearing about new projects and opportunities.
              Whether you have a question or just want to say hi, feel free to reach out.
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              <a
                href="mailto:hello@johndoe.dev"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={16} className="text-accent" />
                hello@johndoe.dev
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone size={16} className="text-accent" />
                +91 12345 67890
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  className="bg-secondary/50 border-border"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <Textarea
                id="message"
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                rows={5}
                className="bg-secondary/50 border-border resize-none"
              />
              <Button variant="hero" size="lg" type="submit" disabled={sending}>
                <Send size={16} />
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <TooltipProvider delayDuration={200}>
              <div className="flex items-center gap-6 flex-wrap">
                {[
                  { icon: Github, label: "GitHub", href: "https://github.com/topics/e-commerce-website", tooltip: "You'll be redirected to John's Github" },
                  { icon: Linkedin, label: "LinkedIn", href: "http://linkedin.com/me", tooltip: "You'll be redirected to John's LinkedIn" },
                  { icon: MessageCircle, label: "WhatsApp", href: whatsappLink, tooltip: "You'll be redirected to John's WhatsApp chat" },
                  { icon: Code2, label: "Leetcode", href: "http://leetcode.com/me", tooltip: "You'll be redirected to John's Leetcode profile" },
                  { icon: Terminal, label: "Hackerrank", href: "http://hackerrank.com/me", tooltip: "You'll be redirected to John's Hackerrank profile" },
                ].map(({ icon: Icon, label, href, tooltip }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon size={16} />
                        {label}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {tooltip}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
