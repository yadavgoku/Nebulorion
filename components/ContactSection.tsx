"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative bg-[#050508]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Get In Touch</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Let&apos;s build the future together.</h3>
            <p className="text-foreground/70 text-lg mb-10 max-w-md">
              We are open to partnerships, early access collaborations, and investor conversations. Drop us a line.
            </p>
            
            <div className="flex items-center gap-4 text-foreground hover:text-primary transition-colors mb-12">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-foreground/50 mb-1">Email us at</p>
                <a href="mailto:hello@nebulorions.com" className="text-xl font-bold tracking-wide">
                  hello@nebulorions.com
                </a>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-sm text-foreground/80 font-medium italic">
                &quot;Innovation happens when bold ideas meet precise execution.&quot;
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 bg-background p-8 rounded-3xl border border-white/5 shadow-2xl">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "idle" && (
                  <>
                    Send Message <ArrowRight size={18} />
                  </>
                )}
                {status === "loading" && <Loader2 size={18} className="animate-spin" />}
                {status === "success" && "Message Sent!"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
