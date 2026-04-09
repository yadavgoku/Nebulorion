"use client";

import { motion } from "framer-motion";

export default function VisionSection() {
  return (
    <section id="vision" className="py-32 relative bg-primary/5 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0F] mix-blend-color-burn" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/20 blur-[150px] mix-blend-screen rounded-[100%]" />
      
      <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
            India deserves platforms it can trust.
          </span>
          <br className="hidden md:block" />
          <span className="text-white mt-4 block">
            Nebulorion exists to build them — one product at a time.
          </span>
        </motion.h2>
      </div>
    </section>
  );
}
