"use client";

import { motion } from "framer-motion";

const tiles = [
  {
    title: "Built for Bharat",
    desc: "Designed for Indian infrastructure, Indian scale, and unprecedented resilience.",
    colSpan: "md:col-span-2",
  },
  {
    title: "Product-First",
    desc: "We don't code for clients. We engineer ecosystems for people.",
    colSpan: "md:col-span-1",
  },
  {
    title: "Trust by Design",
    desc: "Every platform embeds extreme transparency and architectural accountability.",
    colSpan: "md:col-span-1",
  },
  {
    title: "Real Problems Only",
    desc: "We solely tackle deep, foundational pain points.",
    colSpan: "md:col-span-1",
  },
  {
    title: "Ecosystem Focus",
    desc: "Our isolated apps are built to collide and form continuous platforms.",
    colSpan: "md:col-span-1",
  },
];

export default function WhySection() {
  return (
    <section className="py-32 relative bg-transparent z-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold tracking-[0.2em] text-foreground/80 uppercase mb-8"
          >
            Design Principles
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-black text-white max-w-2xl mx-auto tracking-tighter"
          >
            The DNA of our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">products.</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
              className={`relative group p-10 rounded-[2rem] bg-[#0A0A0F]/60 border-[0.5px] border-white/10 backdrop-blur-2xl overflow-hidden hover:border-primary/40 transition-all duration-700 ${tile.colSpan} shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative z-10 h-full flex flex-col justify-end min-h-[160px]">
                <h4 className="text-3xl font-black text-white mb-4 group-hover:text-primary transition-colors duration-500 tracking-tight">
                  {tile.title}
                </h4>
                <p className="text-foreground/50 text-[15px] leading-relaxed font-medium">
                  {tile.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
