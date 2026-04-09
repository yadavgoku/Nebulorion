"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export default function ParallaxImage({ src, alt, className = "", speed = 1 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate the movement based on the speed factor
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 20}%`, `${speed * 20}%`]);

  return (
    <div ref={ref} className={`parallax-image-wrapper ${className}`}>
      <motion.img 
        src={src} 
        alt={alt} 
        style={{ y, scale: 1.15 }} // 1.15 scale ensures we don't see margins when transforming
      />
    </div>
  );
}
