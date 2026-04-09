"use client";

import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function TeamSection() {
  return (
    <section id="team" className="py-24 relative bg-background">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Leadership</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">The minds behind the mission.</h3>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-sm group"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white/5 border border-white/10 mb-6">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50 z-10" />
              <div className="w-full h-full flex flex-col items-center justify-center pt-10 px-8 text-center text-foreground/40 bg-[url('/noise.png')] opacity-80 mix-blend-overlay">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white/50">N</span>
                </div>
                <p className="text-sm uppercase tracking-widest font-bold">Photo</p>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="text-2xl font-bold text-white mb-2">Founder & CEO</h4>
              <p className="text-primary font-medium mb-4">Nebulorion Innovations Pvt. Ltd.</p>
              <div className="flex items-center justify-center gap-4">
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:text-white hover:bg-white/10 transition-colors">
                  <Linkedin size={20} />
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:text-white hover:bg-white/10 transition-colors">
                  <Twitter size={20} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
