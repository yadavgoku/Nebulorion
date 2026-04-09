"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";
import { Box, Sphere, Icosahedron, Torus } from "@react-three/drei";

export default function NebulorionCore({
  scrollYProgress,
  reduceMotion = false,
}: {
  scrollYProgress: MotionValue<number>;
  reduceMotion?: boolean;
}) {
  const coreRef = useRef<THREE.Group>(null);
  const outerShellRef = useRef<THREE.Group>(null);
  const dataNodesRef = useRef<THREE.Group>(null);
  const particleCoreRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const shellDirections = useMemo(
    () =>
      [...Array(4)].map((_, i) => {
        const angle = (i * Math.PI) / 2;
        return new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
      }),
    []
  );
  const nodeDirections = useMemo(
    () =>
      [...Array(8)].map((_, i) => {
        const angle = (i * Math.PI) / 4;
        return new THREE.Vector3(Math.cos(angle), Math.sin(angle) * 0.5, Math.sin(angle));
      }),
    []
  );
  const maxExplodeDistance = reduceMotion ? 1.6 : 2.5;
  const nodeSpreadDistance = reduceMotion ? 1.2 : 1.8;
  const baseRotation = reduceMotion ? 0.08 : 0.15;

  useFrame((state) => {
    // Read the framer-motion scroll progress 
    const progress = scrollYProgress.get();
    const time = state.clock.getElapsedTime();

    // Bias the first viewport toward a slightly top/open view so the inner structure is visible immediately.
    const initialViewBias = Math.max(0, 1 - progress / 0.2);

    // Constant slow rotation of the entire object
    if (coreRef.current) {
      coreRef.current.rotation.y = time * baseRotation;
      coreRef.current.rotation.x = time * (reduceMotion ? 0.02 : 0.05) + initialViewBias * (reduceMotion ? 0.18 : 0.32);
      
      // Floating effect
      coreRef.current.position.y = Math.sin(time * 0.8) * (reduceMotion ? 0.12 : 0.2);
    }

    // Explode logic based on scroll progress
    // Hero 0-0.15 : fully assembled
    // Reveal 0.15-0.4 : exploding (outer shells expand)
    // Perf 0.4-0.65 : highly exploded (inner nodes reveal)
    // Scale 0.65-0.85 : rotating around parts
    // CTA 0.85-1.0 : reassembling

    let explodeFactor = 0;
    
    if (progress <= 0.1) {
      // Keep a slight opening at the very beginning for better interior visibility.
      explodeFactor = reduceMotion ? 0.12 : 0.2;
    } else if (progress > 0.1 && progress <= 0.15) {
      // Smoothly return to fully assembled before the reveal section starts.
      const t = (progress - 0.1) / 0.05;
      explodeFactor = (reduceMotion ? 0.12 : 0.2) * (1 - t);
    } else if (progress > 0.15 && progress <= 0.4) {
      // 0.15 to 0.4 maps to 0.0 to 1.0 explosion
      explodeFactor = (progress - 0.15) / 0.25;
    } else if (progress > 0.4 && progress <= 0.85) {
      explodeFactor = 1; // Fully exploded
      
      // Spin it faster when exploded to show off the inside
      if (!reduceMotion && coreRef.current) {
         coreRef.current.rotation.y += Math.sin(time) * 0.02 * Math.min((progress - 0.4) / 0.1, 1);
      }
    } else if (progress > 0.85) {
      // 0.85 to 1.0 maps to 1.0 to 0.0 explosion (reassembly)
      explodeFactor = 1 - Math.min((progress - 0.85) / 0.15, 1);
    }

    // "who-we-are" section emphasis (roughly progress 0.12 - 0.27):
    // enforce a clearly open state similar to the later expanded look.
    let whoWeAreOpenBoost = 0;
    if (progress >= 0.12 && progress <= 0.27) {
      const t = (progress - 0.12) / 0.15; // 0..1
      const eased = 1 - Math.abs(2 * t - 1); // triangle peak in middle
      const boost = (reduceMotion ? 0.12 : 0.24) * eased;
      const minOpen = reduceMotion ? 0.45 : 0.62;
      explodeFactor = Math.max(minOpen, Math.min(1, explodeFactor + boost));
      whoWeAreOpenBoost = (reduceMotion ? 0.3 : 0.6) * eased + (reduceMotion ? 0.12 : 0.2);
    }

    // Apply easing to explodeFactor (smoothstep logic)
    const easedExplode = explodeFactor * explodeFactor * (3 - 2 * explodeFactor);
    const alternatePulse = Math.sin(time * (reduceMotion ? 0.9 : 1.35));
    const alternatePulseSecondary = Math.cos(time * (reduceMotion ? 0.7 : 1.1));

    // 1. Move Outer Shells Apart
    if (outerShellRef.current) {
      outerShellRef.current.children.forEach((child, i) => {
         const pushOutDir = shellDirections[i];
         const parity = i % 2 === 0 ? 1 : -1;
         const alternatingScale = 1 + parity * alternatePulse * (reduceMotion ? 0.03 : 0.08);
         
         // Animate outward and lift slightly
         child.position.x =
           pushOutDir.x * (easedExplode * maxExplodeDistance * (1 + whoWeAreOpenBoost) * alternatingScale);
         child.position.y =
           parity * easedExplode * (reduceMotion ? 0.35 : 0.5) +
           parity * alternatePulseSecondary * (reduceMotion ? 0.02 : 0.06);
         child.position.z =
           pushOutDir.z * (easedExplode * maxExplodeDistance * (1 + whoWeAreOpenBoost) * alternatingScale);

         // Tilt them outward like a blooming flower or broken glass
         child.rotation.x =
           easedExplode * (reduceMotion ? 0.22 : 0.3) * (parity === 1 ? Math.PI / 4 : -Math.PI / 4) +
           parity * alternatePulse * (reduceMotion ? 0.03 : 0.07);
      });
    }

    // 2. Spread Data Nodes (middle layer)
    if (dataNodesRef.current) {
       dataNodesRef.current.children.forEach((child, i) => {
          const pushOutDir = nodeDirections[i];
          const parity = i % 2 === 0 ? 1 : -1;
          const alternatingScale = 1 + parity * alternatePulseSecondary * (reduceMotion ? 0.04 : 0.1);
          
          child.position.x =
            pushOutDir.x * (easedExplode * nodeSpreadDistance * (1 + whoWeAreOpenBoost * 0.8) * alternatingScale);
          child.position.y =
            pushOutDir.y * (easedExplode * nodeSpreadDistance * (1 + whoWeAreOpenBoost * 0.8) * alternatingScale) +
            Math.sin(time * (reduceMotion ? 1.2 : 2) + i) * (reduceMotion ? 0.1 : 0.2);
          child.position.z =
            pushOutDir.z * (easedExplode * nodeSpreadDistance * (1 + whoWeAreOpenBoost * 0.8) * alternatingScale);

          child.rotation.x = time * (reduceMotion ? 0.5 : 1) + i;
          child.rotation.y = time * (reduceMotion ? 0.3 : 0.5);
       });
    }

    // 3. Separate Rings
    if (ringsRef.current) {
        ringsRef.current.children.forEach((child, i) => {
            const parity = i % 2 === 0 ? 1 : -1;
            child.rotation.x = (Math.PI / 2) + easedExplode * (i === 0 ? 1 : -1) * (reduceMotion ? 0.65 : 1);
            child.rotation.y =
              time * (i === 0 ? 0.2 : -0.2) +
              easedExplode * Math.PI * (reduceMotion ? 0.7 : 1) +
              parity * alternatePulse * (reduceMotion ? 0.03 : 0.08);
            child.scale.setScalar(1 + easedExplode * (reduceMotion ? 0.25 : 0.5) + parity * alternatePulseSecondary * (reduceMotion ? 0.01 : 0.03));
        });
    }
    
    // 4. Pulse Particle Core
    if (particleCoreRef.current) {
        // Particles pulse slightly more when exploded
        const scale = 1 + easedExplode * (reduceMotion ? 0.2 : 0.3) + Math.sin(time * 3) * (reduceMotion ? 0.03 : 0.05);
        particleCoreRef.current.scale.set(scale, scale, scale);
        particleCoreRef.current.rotation.z = time * (reduceMotion ? 0.18 : 0.3);
    }
  });

  return (
    <group ref={coreRef}>
      
      {/* 1. The glowing inner particle core (representing the "heart" / intelligence) */}
      <group ref={particleCoreRef}>
        <Icosahedron args={[0.8, 1]}>
          <meshStandardMaterial 
            color="#22c55e" 
            emissive="#14532d" 
            emissiveIntensity={1.5} 
            wireframe 
            transparent 
            opacity={0.6}
          />
        </Icosahedron>
        {/* Core solid center, pure matte black */}
        <Sphere args={[0.5, 32, 32]}>
           <meshPhysicalMaterial 
             color="#010101" 
             roughness={0.2} 
             metalness={0.8} 
             clearcoat={1} 
           />
        </Sphere>
      </group>

      {/* 2. Middle Data Nodes / Processing layers */}
      <group ref={dataNodesRef}>
        {[...Array(8)].map((_, i) => (
          <Box key={i} args={[0.15, 0.6, 0.15]}>
             <meshPhysicalMaterial 
                color="#050505" 
                metalness={0.9} 
                roughness={0.1}
                clearcoat={1}
                envMapIntensity={2}
             />
          </Box>
        ))}
      </group>

      {/* Futuristic Orbit Rings */}
      <group ref={ringsRef}>
          <Torus args={[1.6, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
             <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
          </Torus>
          <Torus args={[1.7, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
             <meshStandardMaterial color="#14532d" emissive="#14532d" emissiveIntensity={0.5} />
          </Torus>
      </group>

      {/* 3. Outer Structural Shells (Monolith/Armor) */}
      <group ref={outerShellRef}>
        {[...Array(4)].map((_, i) => {
           const angle = i * Math.PI / 2;
           return (
             <group key={i} rotation={[0, angle, 0]}>
               {/* Slabs of black glass making up the outer body */}
               <Box args={[1.8, 4, 0.3]} position={[0, 0, 1.3]}>
                 <meshPhysicalMaterial 
                   color="#050505" 
                   metalness={0.8} 
                   roughness={0.1} 
                   envMapIntensity={3}
                   clearcoat={1}
                   clearcoatRoughness={0.1}
                 />
               </Box>
               {/* Smaller accents on the outer shell */}
               <Box args={[1.4, 3, 0.1]} position={[0, -0.2, 1.45]}>
                 <meshStandardMaterial color="#0A0A0C" roughness={0.9} />
               </Box>
             </group>
           )
        })}
      </group>
      
    </group>
  );
}
