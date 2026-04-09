"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 3000, color = "#7C3AED", radius = 15, speed = 0.05 }) {
  const points = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Distribute points volumetrically within a sphere using cbrt for even distribution
        const r = radius * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        p[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
        p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
        p[i * 3 + 2] = r * Math.cos(phi); // z
    }
    return p;
  }, [count, radius]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y -= delta * speed;
      points.current.rotation.x -= delta * (speed * 0.4);
      
      // Add subtle wave effect based on time
      points.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0A0A0F]">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} gl={{ powerPreference: "high-performance", antialias: false }}>
        <fog attach="fog" args={["#0A0A0F", 5, 25]} />
        <ambientLight intensity={0.5} />
        
        {/* Core Nebula */}
        <Particles count={5000} color="#7C3AED" radius={18} speed={0.03} />
        {/* Secondary Constellation Layer */}
        <Particles count={2500} color="#0D9488" radius={12} speed={0.05} />
        {/* Faster, smaller bright stars */}
        <Particles count={1000} color="#F5F5F5" radius={20} speed={0.08} />

      </Canvas>
    </div>
  );
}
