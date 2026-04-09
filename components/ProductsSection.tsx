"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Bus, Target, ShieldCheck } from "lucide-react";
import { useState } from "react";

const products = [
  {
    name: "BUSNEST",
    tagline: "Smart ticketing for smarter transit.",
    description: "A cashless smart bus ticketing and travel management platform. Passengers book instantly, conductors verify digitally, and operators track revenue in real time.",
    icon: Bus,
    color: "from-blue-500 to-cyan-400",
    bgAccent: "bg-blue-500/10",
  },
  {
    name: "HYPERSPOT",
    tagline: "Offers that find you, not the other way around.",
    description: "An intelligent hyper-local offers platform pushing genuinely relevant deals based on live location and interests, helping businesses reach the right customers.",
    icon: Target,
    color: "from-fuchsia-500 to-purple-500",
    bgAccent: "bg-fuchsia-500/10",
  },
  {
    name: "VERIDROP",
    tagline: "Where bad experiences become resolved ones.",
    description: "A trusted consumer grievance platform where professionals help users resolve issues. It builds a benchmark for consumer trust and corporate accountability.",
    icon: ShieldCheck,
    color: "from-emerald-400 to-teal-500",
    bgAccent: "bg-teal-500/10",
  },
];

function TiltCard({ product, index }: { product: typeof products[0], index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Calculate glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setHover(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
      style={{ perspective: 1200 }}
      className="w-full h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative group w-full h-full bg-[#0d0d12]/60 border border-white/5 rounded-3xl p-8 backdrop-blur-xl transition-all shadow-2xl overflow-hidden cursor-crosshair h-auto min-h-[400px]"
      >
        {/* Dynamic glare effect based on mouse */}
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4) 0%, transparent 40%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Global ambient background glow */}
        <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full mix-blend-screen opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none ${product.bgAccent}`} />
        
        {/* Card Content shifted forward in Z space */}
        <div className="relative z-10 flex flex-col h-full pointer-events-none" style={{ transform: "translateZ(50px)" }}>
          <div className="flex justify-between items-start mb-10 w-full">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} p-[1px] shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-shadow duration-500`}>
              <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                <product.icon className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
              </div>
            </div>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-foreground/70 group-hover:bg-white/10 group-hover:text-white transition-colors"
            >
              Coming Soon
            </motion.span>
          </div>

          <h4 className="text-3xl font-black text-white mb-3 tracking-wide drop-shadow-md">{product.name}</h4>
          <p className={`text-base font-bold bg-clip-text text-transparent bg-gradient-to-r ${product.color} mb-6 drop-shadow-sm`}>
            {product.tagline}
          </p>
          <div className="flex-grow">
            <p className="text-foreground/60 leading-[#1.8] text-[15px] font-medium">
              {product.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductsSection() {
  return (
    <section id="products" className="py-32 relative bg-transparent z-10">
      <div className="max-w-[1300px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h2 className="inline-block px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold tracking-[0.3em] text-primary uppercase mb-8 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
            Our Ecosystem
          </h2>
          <h3 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl">
            Platforms in <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-600">Development</span>
          </h3>
          <p className="text-foreground/50 max-w-2xl mx-auto text-xl font-light">
            Each platform is engineered to dismantle complexity and build unprecedented value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product, index) => (
            <TiltCard key={index} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
