"use client";

import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { Cinzel, Manrope, Orbitron } from "next/font/google";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { TouchEvent, useCallback, useEffect, useRef, useState } from "react";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "600", "700"] });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["500", "600", "700"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const beats = [
  "hero",
  "who-we-are",
  "what-we-do",
  "initiatives",
  "philosophy",
  "how-we-build",
  "vision",
  "closing",
] as const;

type Beat = (typeof beats)[number];
type TrailPoint = {
  id: number;
  x: number;
  y: number;
  life: number;
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [activeBeat, setActiveBeat] = useState<Beat>(beats[0]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);
  const trailIdRef = useRef(0);
  const activeBeatRef = useRef<Beat>(beats[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!lastMouseRef.current) {
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 2) return;

      const point: TrailPoint = {
        id: trailIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        life: 1,
      };

      setTrailPoints((prev) => [...prev.slice(-90), point]);
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      lastMouseRef.current = null;
    };

    let rafId = 0;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - lastTime);
      lastTime = now;
      // Slow fade so trail remains briefly after mouse stops.
      const decay = dt / 1100;
      setTrailPoints((prev) =>
        prev
          .map((p) => ({ ...p, life: p.life - decay }))
          .filter((p) => p.life > 0)
      );
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseLeave);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  useEffect(() => {
    activeBeatRef.current = activeBeat;
  }, [activeBeat]);

  useEffect(() => {
    if (!mounted) return;
    const HYSTERESIS_PX = 80;
    let rafId = 0;
    let scheduled = false;

    const getBeatOffsets = (): Record<Beat, number> => {
      return beats.reduce(
        (acc, beat) => {
          const el = document.getElementById(beat);
          acc[beat] = el ? el.offsetTop : 0;
          return acc;
        },
        {} as Record<Beat, number>
      );
    };

    let beatOffsets = getBeatOffsets();

    const getNearestBeat = () => {
      const y = window.scrollY + 140; // account for fixed navbar and scroll padding
      let nearest: Beat = beats[0];
      let nearestDistance = Number.POSITIVE_INFINITY;

      beats.forEach((beat) => {
        const distance = Math.abs(beatOffsets[beat] - y);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = beat;
        }
      });

      const current = activeBeatRef.current;
      const currentDistance = Math.abs((beatOffsets[current] ?? 0) - y);

      // Prevent rapid flip-flop near section boundaries.
      if (nearest !== current && nearestDistance + HYSTERESIS_PX < currentDistance) {
        setActiveBeat(nearest);
      }
    };

    const requestSync = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(() => {
        scheduled = false;
        getNearestBeat();
      });
    };

    // Initial sync (handles refresh/open with hash)
    requestSync();

    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if ((beats as readonly string[]).includes(hash)) {
        setActiveBeat(hash as Beat);
        activeBeatRef.current = hash as Beat;
      } else {
        requestSync();
      }
    };

    const onResize = () => {
      beatOffsets = getBeatOffsets();
      requestSync();
    };

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [mounted]);

  const goToBeat = useCallback((targetBeat: Beat) => {
    setActiveBeat(targetBeat);
    const el = document.getElementById(targetBeat);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const shiftBeat = useCallback(
    (direction: 1 | -1) => {
      const currentIndex = beats.indexOf(activeBeat);
      const nextIndex = Math.min(Math.max(currentIndex + direction, 0), beats.length - 1);
      if (nextIndex !== currentIndex) goToBeat(beats[nextIndex]);
    },
    [activeBeat, goToBeat]
  );

  const onTouchStart = (e: TouchEvent<HTMLElement>) => {
    const touch = e.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: TouchEvent<HTMLElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < 40) return;
    shiftBeat(absY >= absX ? (dy < 0 ? 1 : -1) : dx < 0 ? 1 : -1);
  };

  const renderBeat = (beat: Beat) => {
    const labelClass = `${orbitron.className} text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[#4ade80]/85`;
    const headingClass = `${cinzel.className} text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.08]`;
    const bodyClass = `${manrope.className} text-white/78 text-sm md:text-lg leading-relaxed`;

    switch (beat) {
      case "hero":
        return (
          <div className="text-center max-w-5xl mx-auto">
            <p className={`${labelClass} mb-5`}>
              Quietly building the infrastructure of tomorrow.
            </p>
            <h1 className={`${cinzel.className} text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[0.95]`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/88">
                Engineering Systems That Redefine Reality
              </span>
            </h1>
            <p className={`${bodyClass} mt-6 max-w-3xl mx-auto`}>
              We do not follow markets. We observe fractures in the real world and build intelligent systems that resolve them at scale.
            </p>
          </div>
        );
      case "who-we-are":
        return (
          <div className="max-w-4xl rounded-2xl border border-[#166534]/45 bg-[#041008]/72 px-6 py-6 md:px-8 md:py-7 shadow-[0_14px_45px_rgba(8,35,20,0.45)]">
            <p className={`${labelClass} mb-4`}>Who We Are</p>
            <h2 className={headingClass}>Nebulorion Innovations Pvt. Ltd.</h2>
            <div className={`${manrope.className} mt-5 space-y-3 text-white/78 text-sm md:text-lg leading-relaxed`}>
              <p>
                Nebulorion Innovations Pvt. Ltd. is a product-driven venture studio focused on identifying structural inefficiencies in real-world systems and rebuilding them through intelligent, scalable technology.
              </p>
              <p>We do not begin with ideas. We begin where systems fail.</p>
              <p>Not obvious failures, the silent ones people adapt to and accept.</p>
              <p>Most systems do not break loudly. They fail quietly every single day.</p>
              <p>That is where we work.</p>
              <p>
                We study these failures at their root, where intent gets lost, trust degrades, and coordination collapses, and rebuild them as cohesive, self-sustaining systems.
              </p>
              <p>We do not improve systems. We redefine how they function.</p>
              <p>
                When done right, the technology disappears, and everything simply works as it should.
              </p>
            </div>
          </div>
        );
      case "what-we-do":
        return (
          <div className="max-w-4xl text-right rounded-2xl border border-[#166534]/45 bg-[#041008]/72 px-6 py-6 md:px-8 md:py-7 shadow-[0_14px_45px_rgba(8,35,20,0.45)]">
            <p className={`${labelClass} mb-4`}>What We Do</p>
            <h2 className={headingClass}>We build systems of impact.</h2>
            <p className={`${bodyClass} mt-5`}>
              We do not build features. Every product we create is designed to solve a real-world friction point, scale without dependency, integrate naturally into human routines, and operate with intelligence, not noise.
            </p>
            <p className={`${manrope.className} mt-5 text-white/70 text-sm md:text-base`}>
              Most people see products. We see behavioral shifts waiting to happen.
            </p>
          </div>
        );
      case "initiatives":
        return (
          <div className="w-full max-w-5xl rounded-2xl border border-[#166534]/45 bg-[#041008]/72 px-6 py-6 md:px-8 md:py-7 shadow-[0_14px_45px_rgba(8,35,20,0.45)]">
            <p className={`${labelClass} mb-4`}>Current Initiatives</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-[#166534]/35 bg-[#04150a]/75 p-5">
                <h3 className={`${cinzel.className} text-xl md:text-2xl font-semibold text-white`}>01 - Intelligent Local Signal Systems</h3>
                <p className={`${manrope.className} mt-2 text-white/75 text-sm md:text-base leading-relaxed`}>
                  A framework that understands intent, timing, and proximity, enabling value to reach the right individual at the exact moment it matters.
                </p>
                <p className={`${manrope.className} mt-2 text-[#4ade80]/85 text-sm md:text-base`}>Not discovery. Precision alignment between need and opportunity.</p>
              </div>
              <div className="rounded-2xl border border-[#166534]/35 bg-[#04150a]/75 p-5">
                <h3 className={`${cinzel.className} text-xl md:text-2xl font-semibold text-white`}>02 - Trust Reconstruction Layer</h3>
                <p className={`${manrope.className} mt-2 text-white/75 text-sm md:text-base leading-relaxed`}>
                  In a world of increasing digital noise and masked identities, we are building systems that reintroduce verifiable truth, accountability, and clarity into human interactions.
                </p>
                <p className={`${manrope.className} mt-2 text-[#4ade80]/85 text-sm md:text-base`}>Trust is not a feature. It is infrastructure.</p>
              </div>
              <div className="rounded-2xl border border-[#166534]/35 bg-[#04150a]/75 p-5">
                <h3 className={`${cinzel.className} text-xl md:text-2xl font-semibold text-white`}>03 - Mobility Intelligence Network</h3>
                <p className={`${manrope.className} mt-2 text-white/75 text-sm md:text-base leading-relaxed`}>
                  Reimagining how movement works in densely populated environments by introducing real-time coordination, visibility, and seamless interaction across transport ecosystems.
                </p>
                <p className={`${manrope.className} mt-2 text-[#4ade80]/85 text-sm md:text-base`}>Movement should be predictable, not chaotic.</p>
              </div>
            </div>
          </div>
        );
      case "philosophy":
        return (
          <div className="max-w-4xl rounded-2xl border border-[#166534]/45 bg-[#041008]/72 px-6 py-6 md:px-8 md:py-7 shadow-[0_14px_45px_rgba(8,35,20,0.45)]">
            <p className={`${labelClass} mb-4`}>Our Philosophy</p>
            <h2 className={headingClass}>
              The future will not be built by louder companies.
            </h2>
            <p className={`${bodyClass} mt-4`}>
              It will be built by those who understand reality better than others.
            </p>
            <ul className={`${manrope.className} mt-6 space-y-3 text-white/78 text-sm md:text-base leading-relaxed`}>
              <li>Technology should feel invisible, not overwhelming.</li>
              <li>Systems should adapt to humans, not the other way around.</li>
              <li>True innovation removes friction, not adds features.</li>
            </ul>
          </div>
        );
      case "how-we-build":
        return (
          <div className="max-w-4xl text-right rounded-2xl border border-[#166534]/45 bg-[#041008]/72 px-6 py-6 md:px-8 md:py-7 shadow-[0_14px_45px_rgba(8,35,20,0.45)]">
            <p className={`${labelClass} mb-4`}>How We Build</p>
            <h2 className={headingClass}>Our 3-layer execution model</h2>
            <div className={`${manrope.className} mt-6 space-y-4 text-white/78 text-sm md:text-base leading-relaxed`}>
              <p><span className="text-white/95 font-semibold">01 - Observation:</span> We study real-world inefficiencies, not trends.</p>
              <p><span className="text-white/95 font-semibold">02 - Deconstruction:</span> We break systems down to their behavioral core.</p>
              <p><span className="text-white/95 font-semibold">03 - Reconstruction:</span> We rebuild them using intelligent, scalable architecture.</p>
            </div>
            <p className={`${manrope.className} mt-6 text-white/65 text-sm md:text-base`}>If it does not scale silently, we do not build it.</p>
          </div>
        );
      case "vision":
        return (
          <div className="max-w-4xl rounded-2xl border border-[#166534]/45 bg-[#041008]/72 px-6 py-6 md:px-8 md:py-7 shadow-[0_14px_45px_rgba(8,35,20,0.45)]">
            <p className={`${labelClass} mb-4`}>Vision</p>
            <h2 className={headingClass}>
              A hub of intelligent systems that seamlessly integrate into daily life.
            </h2>
            <p className={`${bodyClass} mt-5`}>
              We are eliminating inefficiencies across industries without demanding attention.
            </p>
          </div>
        );
      case "closing":
      default:
        return (
          <div className="text-center max-w-4xl mx-auto rounded-2xl border border-[#166534]/45 bg-[#041008]/72 px-6 py-7 md:px-8 md:py-8 shadow-[0_14px_45px_rgba(8,35,20,0.45)]">
            <p className={`${labelClass} mb-4`}>Closing Statement</p>
            <h2 className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.08]`}>
              We are not here to participate in the market.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#4ade80]/90">
                We are here to reshape how it works.
              </span>
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
              <a
                href="#initiatives"
                className="relative px-7 py-3.5 text-sm sm:text-base font-medium text-white transition-all rounded-full overflow-hidden group hover:scale-105 duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0f2f1c] to-[#166534] opacity-90 group-hover:opacity-100 transition-opacity"></span>
                <span className="absolute inset-[1px] bg-[#050505] rounded-full transition-colors group-hover:bg-[#0A0A0C]"></span>
                <span className="relative">Explore the Future We&apos;re Building</span>
              </a>
              <a href="#contact" className="text-white/80 hover:text-[#22c55e] transition-colors underline underline-offset-4 text-sm tracking-wide">
                Connect With Us
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-white/60">
              <span className="rounded-full border border-[#4ade80]/30 bg-[#05240f]/45 px-3 py-1">Currently in controlled development</span>
              <span className="rounded-full border border-[#4ade80]/30 bg-[#05240f]/45 px-3 py-1">Selective access only</span>
              <span className="rounded-full border border-[#4ade80]/30 bg-[#05240f]/45 px-3 py-1">Built for scale. Designed for silence.</span>
              <span className="rounded-full border border-[#4ade80]/30 bg-[#05240f]/45 px-3 py-1">Early-stage systems. Long-term impact.</span>
            </div>
          </div>
        );
    }
  };

  return (
    <main
      className="relative w-full h-[860vh] bg-[#020503]"
      id="top"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence>
        {!mounted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-white/60 tracking-[0.2em] uppercase text-sm"
            >
              Loading Experience...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <div className="fixed top-0 left-0 w-full h-[100vh] z-0 pointer-events-none">
        {mounted && <Scene scrollYProgress={scrollYProgress} reduceMotion={!!shouldReduceMotion} />}
      </div>

      {beats.map((beat, index) => (
        <div key={beat} id={beat} className="absolute" style={{ top: `${index * 105 + 2}vh` }} />
      ))}
      <div id="contact" className="absolute top-[845vh]" />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vh] bg-gradient-radial from-[#06150c]/80 via-[#041008]/45 to-transparent rounded-full opacity-85 blur-3xl pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55 pointer-events-none z-[6]" />

      {mounted && (
        <div className="fixed top-0 left-0 w-full h-[100vh] z-10 pointer-events-none px-3 sm:px-8 md:px-12 pt-24 sm:pt-0">
          {beats.map((beat) => (
            <motion.div
              key={beat}
              animate={{
                opacity: shouldReduceMotion ? (beat === beats[0] ? 1 : 0) : activeBeat === beat ? 1 : 0,
                x:
                  beat === "what-we-do" || beat === "how-we-build"
                    ? activeBeat === beat
                      ? 0
                      : 24
                    : activeBeat === beat
                      ? 0
                      : -24,
                y: activeBeat === beat ? 0 : 16,
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={`absolute inset-0 flex flex-col justify-center overflow-y-auto ${
                beat === "hero" || beat === "closing" ? "items-center text-center" : ""
              }`}
            >
              {renderBeat(beat)}
            </motion.div>
          ))}
        </div>
      )}

      {/* Cosmic cursor line effect */}
      {!shouldReduceMotion && (
        <div className="fixed inset-0 pointer-events-none z-[60] hidden md:block">
          <svg className="absolute inset-0 h-full w-full">
            {trailPoints.slice(1).map((point, index) => {
              const prev = trailPoints[index];
              const opacity = Math.min(point.life, prev.life) * 0.85;
              return (
                <line
                  key={point.id}
                  x1={prev.x}
                  y1={prev.y}
                  x2={point.x}
                  y2={point.y}
                  stroke="rgb(34, 169, 86)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity={opacity}
                />
              );
            })}
          </svg>
        </div>
      )}
    </main>
  );
}
