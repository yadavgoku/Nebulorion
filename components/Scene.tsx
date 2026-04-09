"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import NebulorionCore from "./NebulorionCore";

export default function Scene({
  scrollYProgress,
  reduceMotion = false,
}: {
  scrollYProgress: MotionValue<number>;
  reduceMotion?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      dpr={reduceMotion ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      {/* Dramatic cinematic rim lighting */}
      <directionalLight position={[5, 10, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-8, -10, -5]} intensity={1.5} color="#14532d" />
      <spotLight position={[0, -5, 10]} intensity={3} angle={0.6} penumbra={1} color="#22c55e" />
      
      <NebulorionCore scrollYProgress={scrollYProgress} reduceMotion={reduceMotion} />

      {/* City environment brings out the dark reflections on the #050505 surfaces */}
      <Environment preset="city" />
      
    </Canvas>
  );
}
