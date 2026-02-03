"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Navbar from "@/components/user/Navbar";
import Orb from "@/components/ui/Orb";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial visual setup
      gsap.set(containerRef.current, { visibility: "visible" });

      // Animate background visuals
      tl.fromTo(
        ".glow-orb",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.4, duration: 2, stagger: 0.3, ease: "elastic.out(1, 0.5)" }
      );

      // Animate text content
      tl.fromTo(
        headlineRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=1.5"
      );

      tl.fromTo(
        subheadlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
      );

      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      );

      // Continuous subtle movement for orbs
      gsap.to(".glow-orb", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-white selection:text-black invisible"
    >
      <Navbar />

      {/* Background Ambience */}
      <div ref={visualsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="glow-orb absolute top-[-10%] left-[20%] h-125 w-125 rounded-full bg-purple-900/40 blur-[120px]" />
        <div className="glow-orb absolute bottom-[-10%] right-[20%] h-100 w-100 rounded-full bg-blue-900/30 blur-[100px]" />
        <div className="glow-orb absolute top-[40%] left-[80%] h-75 w-75 rounded-full bg-fuchsia-900/20 blur-[80px]" />

        {/* Animated Orb Centerpiece */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60 pointer-events-auto">
          <div className="w-full h-[800px] max-w-5xl">
            <Orb
              hoverIntensity={2}
              rotateOnHover
              hue={0}
              forceHoverState={false}
              backgroundColor="#000000"
            />
          </div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-4 md:px-6 text-center max-w-5xl mx-auto space-y-8">
        <div className="overflow-hidden">
          <h1
            ref={headlineRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-white/60"
          >
            GETTER
          </h1>
        </div>

        <div className="overflow-hidden">
          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl font-light tracking-wide"
          >
            Discover and book the most exclusive events, concerts, and gatherings. Your gateway to unforgettable experiences.
          </p>
        </div>

        <div ref={ctaRef} className="pt-4">
          <Link
            href="/services"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-neutral-200 hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-black"
          >
            <span className="mr-2">Explore Services</span>
            <span className="relative overflow-hidden w-5 h-5 flex items-center justify-center">
              <svg
                className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </main>

      {/* Footer / Bottom Elements */}
      <footer className="absolute bottom-8 w-full text-center text-neutral-600 text-xs tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} Getter &bull; All Rights Reserved</p>
      </footer>
    </div>
  );
}
