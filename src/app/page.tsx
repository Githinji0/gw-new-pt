"use client";

import React, { useState } from "react";
import ImageReveal from "@/components/LandoReveal";
import TargetCursor from "@/components/TargetCursor";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Sticky Top-Center Navigation Button Container */}
      <div className="fixed -top-10 left-1/2 -translate-x-1/2 z-50 w-32 h-32 pointer-events-none flex items-center justify-center">
        
        {/* Gooey Metaballs Background */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ filter: "url(#nav-gooey-filter)" }}
        >
          <defs>
            <filter id="nav-gooey-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            </filter>
          </defs>
          <g fill="#22d3ee" opacity={isOpen ? 0.3 : 0.45} className="transition-opacity duration-300">
            {/* Base anchor circle matching the button size/center */}
            <circle cx="64" cy="64" r="24" />
            {/* Drifting droplets emanating outward */}
            <circle className="animate-metaball-1" cx="64" cy="64" r="12" style={{ transformOrigin: "64px 64px" }} />
            <circle className="animate-metaball-2" cx="64" cy="64" r="9" style={{ transformOrigin: "64px 64px" }} />
            <circle className="animate-metaball-3" cx="64" cy="64" r="11" style={{ transformOrigin: "64px 64px" }} />
            <circle className="animate-metaball-4" cx="64" cy="64" r="8" style={{ transformOrigin: "64px 64px" }} />
          </g>
        </svg>

        {/* Sub-menu Bubble 1: Work */}
        <button
          onClick={() => console.log("Work clicked")}
          className="absolute px-5 py-2.5 rounded-full border border-white/10 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center cursor-target text-[9px] font-semibold tracking-widest uppercase text-white hover:border-white/30 hover:bg-neutral-900 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-0 whitespace-nowrap"
          style={{
            transform: isOpen ? "translate(-95px, 60px) scale(1)" : "translate(0, 0) scale(0)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none"
          }}
        >
          Work
        </button>

        {/* Sub-menu Bubble 2: About */}
        <button
          onClick={() => console.log("About clicked")}
          className="absolute px-5 py-2.5 rounded-full border border-white/10 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center cursor-target text-[9px] font-semibold tracking-widest uppercase text-white hover:border-white/30 hover:bg-neutral-900 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-0 whitespace-nowrap"
          style={{
            transform: isOpen ? "translate(0px, 95px) scale(1)" : "translate(0, 0) scale(0)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transitionDelay: isOpen ? "50ms" : "0ms"
          }}
        >
          About
        </button>

        {/* Sub-menu Bubble 3: Contact */}
        <button
          onClick={() => console.log("Contact clicked")}
          className="absolute px-5 py-2.5 rounded-full border border-white/10 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center cursor-target text-[9px] font-semibold tracking-widest uppercase text-white hover:border-white/30 hover:bg-neutral-900 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-0 whitespace-nowrap"
          style={{
            transform: isOpen ? "translate(95px, 60px) scale(1)" : "translate(0, 0) scale(0)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transitionDelay: isOpen ? "100ms" : "0ms"
          }}
        >
          Contact
        </button>

        {/* The Actionable Circular Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Navigation Menu"
          className="relative w-12 h-12 rounded-full border border-white/15 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center cursor-target pointer-events-auto transition-all duration-300 hover:scale-105 hover:border-white/30 active:scale-95 group z-10"
        >
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100 transition-all duration-500"
            style={{
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)"
            }}
          />
        </button>
      </div>

      {/* Target Cursor Effect */}
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />

      {/* ── GRID: Left text / Right portrait ── */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

        {/* ─── LEFT COLUMN: Typography ─── */}
        <div className="w-full h-auto md:h-full md:flex-1 flex flex-col justify-start md:justify-center px-6 sm:px-12 md:pl-16 lg:pl-24 xl:pl-32 pr-8 relative z-20 pt-24 pb-8 md:pt-0 md:pb-0">

          {/* Achievement counters */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-14 mb-6 md:mb-14">
            {[
              { value: "12+", label: "Years Experience" },
              { value: "86", label: "Projects Delivered" },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="flex flex-col cursor-target px-3 py-2 -mx-3 -my-2 rounded transition-colors duration-300 hover:bg-neutral-900/30"
              >
                <span className="text-2xl lg:text-3xl font-extralight text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1.5 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.2rem,6vw,7rem)] font-extralight text-white leading-[0.95] tracking-[-0.03em] cursor-target inline-block py-2">
            Creative
            <br />
            <span className="font-normal">Director</span>
            <br />
            <span className="text-neutral-500">&amp; Designer</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm text-neutral-500 mt-6 md:mt-10 max-w-xs leading-relaxed font-light">
            Crafting premium digital experiences at the intersection of design,
            technology, and culture.
          </p>

          {/* CTA line */}
          <div className="mt-8 md:mt-14 flex items-center gap-4 cursor-target inline-flex py-2">
            <div className="w-12 h-px bg-neutral-700" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-medium">
              Scroll to explore
            </span>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Portrait ─── */}
        <div className="h-[45vh] md:h-full w-full md:w-[45vw] lg:w-[48vw] flex-shrink-0 relative z-10 pt-6 md:pt-0">
          <ImageReveal />
        </div>
      </div>

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
    </main>
  );
}



