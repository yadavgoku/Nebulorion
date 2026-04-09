"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="who-we-are" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] -z-10" />
      
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Who We Are</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              We don&apos;t just code.<br />
              <span className="text-foreground/60">We build ecosystems.</span>
            </h3>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-foreground/70 text-lg leading-relaxed"
          >
            <p>
              Nebulorion Innovations is a venture studio and product company based in India. We are not a freelance agency or service provider. We ideate, build, and launch our own proprietary digital platforms.
            </p>
            <p>
              Our vision is to create India&apos;s most trusted and user-centric digital ecosystems across transport, commerce, and consumer protection. We focus on scale, precision, and solving deeply felt real-world problems.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
