"use client";

import Image from "next/image";
import { Orbitron } from "next/font/google";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 120], [0.72, 1]);
  const backdropFilter = useTransform(scrollY, [0, 120], ["blur(8px)", "blur(16px)"]);
  const borderOpacity = useTransform(scrollY, [0, 200], [0.05, 0.18]);
  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`;

  return (
    <motion.div style={{ opacity, backdropFilter, borderColor }} className="fixed top-0 left-0 w-full z-50 border-b bg-black/40">
      <nav className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <Image
            src="/logo.png"
            alt="Nebulorion"
            width={56}
            height={56}
            className="h-9 w-9 sm:h-12 sm:w-12 object-contain shrink-0"
            priority
          />
          <span className={`${orbitron.className} text-sm sm:text-lg tracking-[0.08em] whitespace-nowrap`}>
            <span className="text-[rgb(34_169_86)] [text-shadow:0_0_14px_rgba(34,169,86,0.35)]">NEBUL</span>
            <span className="text-white [text-shadow:0_0_12px_rgba(255,255,255,0.22)]">ORION</span>
          </span>
        </a>
        <div className="hidden md:flex items-center space-x-7 text-sm text-white/65">
          <a href="#who-we-are" className="hover:text-white transition-colors">Who We Are</a>
          <a href="#what-we-do" className="hover:text-white transition-colors">What We Do</a>
          <a href="#initiatives" className="hover:text-white transition-colors">Initiatives</a>
          <a href="#vision" className="hover:text-white transition-colors">Vision</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="hidden sm:block">
          <button className="relative px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-sm font-medium text-white transition-all rounded-full overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0f2f1c] to-[#166534] opacity-90 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute inset-[1px] bg-[#040804] rounded-full"></span>
            <span className="relative">Initiate Project</span>
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="sm:hidden relative h-9 w-9 rounded-lg border border-[#166534]/50 bg-[#07140d]/80 text-white/90"
        >
          <span className="absolute left-1/2 top-[11px] h-[1.5px] w-4 -translate-x-1/2 bg-current" />
          <span className="absolute left-1/2 top-[17px] h-[1.5px] w-4 -translate-x-1/2 bg-current" />
          <span className="absolute left-1/2 top-[23px] h-[1.5px] w-4 -translate-x-1/2 bg-current" />
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{
          height: mobileMenuOpen ? "auto" : 0,
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="sm:hidden overflow-hidden px-3"
      >
        <div className="mb-3 rounded-xl border border-[#166534]/45 bg-[#041008]/90 p-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-2 gap-2 text-xs text-white/90">
            <a onClick={() => setMobileMenuOpen(false)} href="#who-we-are" className="rounded-lg bg-[#0a2616] px-3 py-2 text-center">Who We Are</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#what-we-do" className="rounded-lg bg-[#0a2616] px-3 py-2 text-center">What We Do</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#initiatives" className="rounded-lg bg-[#0a2616] px-3 py-2 text-center">Initiatives</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#philosophy" className="rounded-lg bg-[#0a2616] px-3 py-2 text-center">Philosophy</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#vision" className="rounded-lg bg-[#0a2616] px-3 py-2 text-center">Vision</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#closing" className="rounded-lg bg-[#0a2616] px-3 py-2 text-center">Closing</a>
          </div>
          <a
            onClick={() => setMobileMenuOpen(false)}
            href="#contact"
            className="mt-2 block rounded-lg bg-gradient-to-r from-[#0f2f1c] to-[#166534] px-3 py-2 text-center text-xs font-medium text-white"
          >
            Connect With Us
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
