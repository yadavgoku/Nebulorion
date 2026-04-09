"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 50,
        y: (e.clientY / innerHeight - 0.5) * 50,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Interactive Glare Layers */}
      <motion.div
        animate={{ x: mousePos.x * 2, y: mousePos.y * 2 }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[140px] -z-10 mix-blend-screen pointer-events-none"
      />
      <motion.div
        animate={{ x: mousePos.x * -1.5, y: mousePos.y * -1.5 }}
        transition={{ type: "spring", stiffness: 30, damping: 15 }}
        className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-secondary/15 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"
      />

      <motion.div 
        style={{ y, opacity }}
        className="max-w-[1200px] mx-auto px-6 w-full z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold tracking-widest text-foreground/90 uppercase">
            Nebulorion Innovations
          </span>
        </motion.div>

        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter text-white leading-[0.95]"
          >
            We Build Platforms <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#b483f9] to-[#0D9488] relative">
              That Matter.
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-foreground/60 max-w-3xl mx-auto mb-14 leading-relaxed font-light"
        >
          A product studio turning bold ideas into intelligent digital ecosystems — combining deep tech, elegant design, and cosmic scalability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <Link
            href="#products"
            className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-white text-background rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
          >
            <span className="relative z-10">Explore Our Products</span>
            <ArrowUpRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
          
          <Link href="#who-we-are" className="text-foreground/70 font-medium hover:text-white transition-colors flex items-center gap-2 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all hover:after:w-full">
            Our Studio Narrative
          </Link>
        </motion.div>
      </motion.div>

      {/* Extreme gradient fade at bottom to blend into content */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050508] to-transparent -z-10 pointer-events-none" />
    </section>
  );
}
