import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// Add your gallery images here. Place files in public/images/gallery/ and add paths below.
const galleryImages = [
  { src: "/images/profile.png", caption: "Profile" },
  { src: "/images/certi1.jpg", caption: "Certificate 1" },
  { src: "/images/cert2.jpg", caption: "Certificate 2" },
  { src: "/images/ach1.jpg", caption: "Achievement 1" },
  { src: "/images/ach2.jpg", caption: "Achievement 2" },
  { src: "/images/ach3.jpg", caption: "Achievement 3" },
  { src: "/images/intern1.jpg", caption: "Internship 1" },
  { src: "/images/intern2.jpg", caption: "Internship 2" },
  { src: "/images/intern3.jpg", caption: "Internship 3" },
  { src: "/images/intern4.jpg", caption: "Internship 4" },
];

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  useScrollLock(selectedIndex !== null);

  return (
    <section id="gallery" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-[2px] bg-accent" />
            <p className="text-sm font-semibold text-accent tracking-widest uppercase">
              Gallery
            </p>
          </div>
        </motion.div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.08 }}
              className="break-inside-avoid cursor-pointer group"
              onClick={() => setSelectedIndex(i)}
            >
              <div className="relative overflow-hidden rounded-xl border border-border bg-secondary hover:border-accent/40 hover:shadow-lg transition-all duration-300">
                <img
                  src={img.src}
                  alt={img.caption}
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-xs font-medium text-foreground">
                    {img.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-6"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-card/80 border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
              <img
                src={galleryImages[selectedIndex].src}
                alt={galleryImages[selectedIndex].caption}
                className="max-w-full max-h-[80vh] object-contain rounded-xl border-2 border-accent/30 shadow-[0_0_30px_hsl(var(--accent)/0.12)]"
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium text-foreground bg-card/80 border border-border px-4 py-1.5 rounded-full">
                {galleryImages[selectedIndex].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
