"use client";

import React, { useState } from "react";
import ScrambleText from "@/components/ScrambleText";
import LiquidScrollbar from "@/components/LiquidScrollbar";
import DomeGallery from "@/components/DomeGallery";
import ImageReveal from "@/components/LandoReveal";
import TargetCursor from "@/components/TargetCursor";
import LogoLoop from "@/components/LogoLoop";
import ScrollReveal from "@/components/ScrollReveal";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiThreedotjs,
  SiFramer,
} from "react-icons/si";

const techLogos = [
  { node: <SiReact className="text-neutral-500 hover:text-cyan-400 transition-colors duration-300" />, title: "React" },
  { node: <SiNextdotjs className="text-neutral-500 hover:text-white transition-colors duration-300" />, title: "Next.js" },
  { node: <SiTypescript className="text-neutral-500 hover:text-blue-500 transition-colors duration-300" />, title: "TypeScript" },
  { node: <SiTailwindcss className="text-neutral-500 hover:text-cyan-400 transition-colors duration-300" />, title: "Tailwind CSS" },
  { node: <SiThreedotjs className="text-neutral-500 hover:text-white transition-colors duration-300" />, title: "Three.js" },
  { node: <SiFramer className="text-neutral-500 hover:text-pink-500 transition-colors duration-300" />, title: "Framer Motion" },
];

const experiences = [
  { year: "2020 – Now", role: "Creative Director", company: "Independent Studio" },
  { year: "2017 – 2020", role: "Lead UI/UX Designer", company: "Digital Agency, NYC" },
  { year: "2014 – 2017", role: "Front-End Developer", company: "Tech Startup, Berlin" },
];

const values = [
  { label: "Craft", desc: "Every pixel is a decision. Every interaction, intentional." },
  { label: "Clarity", desc: "Complexity made simple. Communication above all." },
  { label: "Culture", desc: "Work that resonates across contexts and borders." },
];

const projects = [
  {
    index: "01",
    title: "Noir — Brand Identity",
    category: "Identity",
    tags: ["Branding", "Motion", "Strategy"],
    year: "2024",
    accent: "rgba(34,211,238,0.12)",
    accentText: "#22d3ee",
  },
  {
    index: "02",
    title: "Vanta — Design System",
    category: "Product",
    tags: ["UI/UX", "Components", "Tokens"],
    year: "2023",
    accent: "rgba(168,85,247,0.12)",
    accentText: "#a855f7",
  },
  {
    index: "03",
    title: "Forma — Editorial Platform",
    category: "Digital",
    tags: ["Next.js", "Three.js", "WebGL"],
    year: "2023",
    accent: "rgba(251,191,36,0.10)",
    accentText: "#fbbf24",
  },
  {
    index: "04",
    title: "Lumen — Campaign Site",
    category: "Campaign",
    tags: ["Art Direction", "Animation", "CMS"],
    year: "2022",
    accent: "rgba(244,114,182,0.10)",
    accentText: "#f472b6",
  },
  {
    index: "05",
    title: "Axis — Motion Reel",
    category: "Motion",
    tags: ["After Effects", "Cinema 4D", "Sound"],
    year: "2022",
    accent: "rgba(52,211,153,0.10)",
    accentText: "#34d399",
  },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const container = document.querySelector("main") as HTMLElement | null;
    const target = id === "hero"
      ? container
      : document.getElementById(id);
    if (container && target) {
      container.scrollTo({
        top: id === "hero" ? 0 : (target as HTMLElement).offsetTop,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <main
      className="relative w-screen h-screen bg-black overflow-y-auto overflow-x-hidden scroll-smooth"
      style={{ scrollSnapType: "y mandatory", overflowX: "clip" }}
    >
      {/* ── Fixed Navigation ── */}
      <div className="fixed -top-10 left-1/2 -translate-x-1/2 z-50 w-32 h-32 pointer-events-none flex items-center justify-center">
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
            <circle cx="64" cy="64" r="24" />
            <circle className="animate-metaball-1" cx="64" cy="64" r="12" style={{ transformOrigin: "64px 64px" }} />
            <circle className="animate-metaball-2" cx="64" cy="64" r="9" style={{ transformOrigin: "64px 64px" }} />
            <circle className="animate-metaball-3" cx="64" cy="64" r="11" style={{ transformOrigin: "64px 64px" }} />
            <circle className="animate-metaball-4" cx="64" cy="64" r="8" style={{ transformOrigin: "64px 64px" }} />
          </g>
        </svg>

        {/* Bubble 1: About */}
        <button
          onClick={() => scrollToSection("about")}
          className="absolute px-5 py-2.5 rounded-full border border-white/10 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center cursor-target text-[9px] font-semibold tracking-widest uppercase text-white hover:border-white/30 hover:bg-neutral-900 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-0 whitespace-nowrap"
          style={{ transform: isOpen ? "translate(-110px, 45px) scale(1)" : "translate(0,0) scale(0)", opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none", transitionDelay: isOpen ? "0ms" : "0ms" }}
        >
          About
        </button>

        {/* Bubble 2: Work */}
        <button
          onClick={() => scrollToSection("work")}
          className="absolute px-5 py-2.5 rounded-full border border-white/10 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center cursor-target text-[9px] font-semibold tracking-widest uppercase text-white hover:border-white/30 hover:bg-neutral-900 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-0 whitespace-nowrap"
          style={{ transform: isOpen ? "translate(-37px, 100px) scale(1)" : "translate(0,0) scale(0)", opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none", transitionDelay: isOpen ? "40ms" : "0ms" }}
        >
          Work
        </button>

        {/* Bubble 3: Gallery */}
        <button
          onClick={() => scrollToSection("gallery")}
          className="absolute px-5 py-2.5 rounded-full border border-white/10 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center cursor-target text-[9px] font-semibold tracking-widest uppercase text-white hover:border-white/30 hover:bg-neutral-900 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-0 whitespace-nowrap"
          style={{ transform: isOpen ? "translate(37px, 100px) scale(1)" : "translate(0,0) scale(0)", opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none", transitionDelay: isOpen ? "80ms" : "0ms" }}
        >
          Gallery
        </button>

        {/* Bubble 4: Contact */}
        <button
          onClick={() => scrollToSection("contact")}
          className="absolute px-5 py-2.5 rounded-full border border-white/10 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center cursor-target text-[9px] font-semibold tracking-widest uppercase text-white hover:border-white/30 hover:bg-neutral-900 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-0 whitespace-nowrap"
          style={{ transform: isOpen ? "translate(110px, 45px) scale(1)" : "translate(0,0) scale(0)", opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none", transitionDelay: isOpen ? "120ms" : "0ms" }}
        >
          Contact
        </button>

        {/* Main toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Navigation Menu"
          className="relative w-12 h-12 rounded-full border border-white/15 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center cursor-target pointer-events-auto transition-all duration-300 hover:scale-105 hover:border-white/30 active:scale-95 group z-10"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100 transition-all duration-500"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </button>
      </div>

      {/* ── Custom Cursor ── */}
      <TargetCursor spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />

      {/* ── Liquid Scrollbar ── */}
      <LiquidScrollbar />

      {/* ═══════════════════════════════════════════
          SECTION 1 · Hero
      ═══════════════════════════════════════════ */}
      <section
        className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        aria-label="Hero"
      >
        {/* Left column */}
        <div className="w-full h-auto md:h-full md:overflow-y-auto md:flex-1 flex flex-col justify-start md:justify-center px-6 sm:px-12 md:pl-16 lg:pl-24 xl:pl-32 pr-8 relative z-20 pt-24 pb-8 md:pt-0 md:pb-0">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-14 mb-6 md:mb-14">
            {[
              { value: "12+", label: "Years Experience" },
              { value: "86", label: "Projects Delivered" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col cursor-target px-3 py-2 -mx-3 -my-2 rounded transition-colors duration-300 hover:bg-neutral-900/30">
                <span className="text-2xl lg:text-3xl font-extralight text-white tracking-tight">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1.5 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          <h1 className="text-[clamp(2.2rem,6vw,7rem)] font-extralight text-white leading-[0.95] tracking-[-0.03em] cursor-target inline-block py-2">
            <ScrambleText text="Creative" chars="lowerCase" duration={1} delay={0.1} /><br />
            <span className="font-normal"><ScrambleText text="Director" chars="lowerCase" duration={1} delay={0.3} /></span><br />
            <span className="text-neutral-500"><ScrambleText text="& Designer" chars="lowerCase" duration={1} delay={0.5} /></span>
          </h1>

          <p className="text-sm text-neutral-500 mt-6 md:mt-10 max-w-xs leading-relaxed font-light">
            <ScrambleText text="Crafting premium digital experiences at the intersection of design, technology, and culture." chars="lowerCase" duration={1.4} delay={0.7} />
          </p>

          <div className="mt-8 md:mt-14 flex items-center gap-4 cursor-target inline-flex py-2">
            <div className="w-12 h-px bg-neutral-700" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-medium">Scroll to explore</span>
          </div>

          <div className="mt-12 md:mt-20 w-full max-w-sm overflow-hidden relative py-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 mb-4 font-semibold">Technology Stack</p>
            <LogoLoop
              logos={techLogos}
              speed={40}
              direction="left"
              logoHeight={24}
              gap={28}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#000000"
              ariaLabel="Technology partners"
            />
          </div>
        </div>

        {/* Right column – portrait */}
        <div className="h-[45vh] md:h-full w-full md:w-[45vw] lg:w-[48vw] flex-shrink-0 relative z-10 pt-6 md:pt-0">
          <ImageReveal />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 · About Me
      ═══════════════════════════════════════════ */}
      <section
        id="about"
        className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 py-24 overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        aria-label="About Me"
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Ambient glows */}
        <div
          className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-6xl w-full mx-auto">

          {/* Section label */}
          <ScrollReveal variant="fade-right" delay={0.1}>
            <div className="flex items-center gap-4 mb-16 md:mb-20">
              <div className="w-8 h-px bg-neutral-700" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 font-semibold">About</span>
            </div>
          </ScrollReveal>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-32">

            {/* ── Left: Bio ── */}
            <div className="flex flex-col gap-10">
              <ScrollReveal variant="clip-up" delay={0.2}>
                <h2 className="text-[clamp(2rem,4.5vw,5rem)] font-extralight text-white leading-[1.05] tracking-[-0.025em]">
                  <ScrambleText text="Building things" chars="lowerCase" duration={1.0} delay={0} /><br />
                  <span className="text-neutral-500"><ScrambleText text="people remember." chars="lowerCase" duration={1.0} delay={0.2} /></span>
                </h2>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.3}>
                <div className="space-y-5 max-w-md">
                  <p className="text-sm text-neutral-400 leading-[1.85] font-light">
                    <ScrambleText text="I'm a creative director and designer with over a decade of experience shaping digital products for startups, studios, and global brands. My work lives at the crossroads of visual precision and technical depth." chars="lowerCase" duration={1.6} delay={0.1} />
                  </p>
                  <p className="text-sm text-neutral-500 leading-[1.85] font-light">
                    <ScrambleText text="I believe great design isn't just seen — it's felt. Every project begins with deep listening, moves through rigorous craft, and ends only when the experience feels inevitable." chars="lowerCase" duration={1.6} delay={0.3} />
                  </p>
                </div>
              </ScrollReveal>

              {/* Values strip */}
              <div className="grid grid-cols-3 gap-0 mt-4 border-t border-neutral-900">
                {values.map((v, i) => (
                  <ScrollReveal
                    key={v.label}
                    variant="fade-up"
                    delay={0.4}
                    staggerIndex={i}
                    staggerStep={0.1}
                    className={`h-full ${i < 2 ? "border-r border-neutral-900" : ""}`}
                  >
                    <div className="flex flex-col gap-2 py-6 pr-4 cursor-target group">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-semibold group-hover:text-neutral-400 transition-colors duration-300">
                        {v.label}
                      </span>
                      <span className="text-xs text-neutral-600 leading-relaxed font-light group-hover:text-neutral-500 transition-colors duration-300">
                        {v.desc}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* ── Right: Experience + Stats ── */}
            <div className="flex flex-col gap-10 lg:pt-2">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "12+", label: "Years" },
                  { value: "86", label: "Projects" },
                  { value: "30+", label: "Clients" },
                ].map((s, i) => (
                  <ScrollReveal
                    key={s.label}
                    variant="fade-up"
                    delay={0.2}
                    staggerIndex={i}
                    staggerStep={0.1}
                  >
                    <div className="flex flex-col gap-1 cursor-target group">
                      <span className="text-3xl lg:text-4xl font-extralight text-white tracking-tight group-hover:text-neutral-200 transition-colors duration-300">
                        {s.value}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 font-medium">{s.label}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <div className="w-full h-px bg-neutral-900" />

              {/* Experience timeline */}
              <div className="flex flex-col">
                <ScrollReveal variant="fade-up" delay={0.3}>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-semibold mb-6">Experience</p>
                </ScrollReveal>
                {experiences.map((exp, i) => (
                  <ScrollReveal
                    key={i}
                    variant="fade-up"
                    delay={0.4}
                    staggerIndex={i}
                    staggerStep={0.1}
                  >
                    <div className="group flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8 py-5 border-b border-neutral-900/70 cursor-target hover:border-neutral-800 transition-colors duration-300 w-full">
                      <span className="text-[10px] text-neutral-600 font-mono whitespace-nowrap pt-0.5 min-w-[90px] group-hover:text-neutral-500 transition-colors duration-300">
                        {exp.year}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-white font-light group-hover:text-neutral-100 transition-colors duration-300">
                          {exp.role}
                        </span>
                        <span className="text-xs text-neutral-600 font-light group-hover:text-neutral-500 transition-colors duration-300">
                          {exp.company}
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Download CTA */}
              <ScrollReveal variant="fade-up" delay={0.5} className="mt-2">
                <button className="group flex items-center gap-3 cursor-target">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold group-hover:text-white transition-colors duration-300">
                    Download CV
                  </span>
                  <div className="w-8 h-px bg-neutral-700 group-hover:w-14 group-hover:bg-neutral-400 transition-all duration-300" />
                </button>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 · Work
      ═══════════════════════════════════════════ */}
      <section
        id="work"
        className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 py-24 overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        aria-label="Work"
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 65%)" }}
        />

        <div className="relative z-10 max-w-6xl w-full mx-auto">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 md:mb-20">
            <div className="flex flex-col gap-5">
              <ScrollReveal variant="fade-right" delay={0.1}>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-neutral-700" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 font-semibold">Work</span>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="clip-up" delay={0.2}>
                <h2 className="text-[clamp(2rem,4.5vw,5rem)] font-extralight text-white leading-[1.05] tracking-[-0.025em]">
                  <ScrambleText text="Selected" chars="lowerCase" duration={0.9} delay={0} /><br />
                  <span className="text-neutral-500"><ScrambleText text="projects." chars="lowerCase" duration={0.9} delay={0.15} /></span>
                </h2>
              </ScrollReveal>
            </div>
            <ScrollReveal variant="fade-up" delay={0.3}>
              <p className="text-sm text-neutral-600 font-light max-w-[220px] leading-relaxed pb-1">
                <ScrambleText text="A curated selection of recent work across identity, product, and digital." chars="lowerCase" duration={1.2} delay={0.2} />
              </p>
            </ScrollReveal>
          </div>

          {/* Project list */}
          <div className="flex flex-col">
            {projects.map((project, i) => (
              <ScrollReveal
                key={project.index}
                variant="fade-up"
                delay={0.3}
                staggerIndex={i}
                staggerStep={0.08}
              >
                <div
                  className="group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 py-6 border-t border-neutral-900 cursor-target transition-all duration-500 hover:border-neutral-800 last:border-b last:border-neutral-900 w-full"
                >
                  {/* Hover background fill */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-sm"
                    style={{ background: project.accent }}
                  />

                  {/* Index */}
                  <span
                    className="relative text-[11px] font-mono text-neutral-700 group-hover:text-neutral-500 transition-colors duration-300 sm:w-12 flex-shrink-0"
                  >
                    {project.index}
                  </span>

                  {/* Title */}
                  <div className="relative flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <h3
                      className="text-base sm:text-lg font-light text-neutral-300 group-hover:text-white transition-colors duration-300 tracking-[-0.01em]"
                    >
                      <ScrambleText text={project.title} chars="lowerCase" duration={0.8} delay={0} />
                    </h3>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border border-neutral-800 text-neutral-600 group-hover:border-neutral-700 group-hover:text-neutral-500 transition-all duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category + Year */}
                  <div className="relative flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 flex-shrink-0 sm:w-28">
                    <span
                      className="text-[9px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300"
                      style={{ color: "#525252" }}
                    >
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-700 group-hover:text-neutral-600 transition-colors duration-300">
                      {project.year}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="relative sm:w-10 flex-shrink-0 flex justify-end">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="w-4 h-4 text-neutral-800 group-hover:text-neutral-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all duration-300"
                      aria-hidden
                    >
                      <path d="M3 13L13 3M13 3H7M13 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* View all CTA */}
          <ScrollReveal variant="fade-up" delay={0.4} className="mt-12">
            <div className="flex items-center justify-between">
              <button className="group flex items-center gap-4 cursor-target">
                <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-neutral-600 transition-colors duration-300">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-300 transition-colors duration-300" aria-hidden>
                    <path d="M3 13L13 3M13 3H7M13 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold group-hover:text-white transition-colors duration-300">
                  View all work
                </span>
              </button>

              <span className="text-[10px] font-mono text-neutral-800">
                {projects.length} / {projects.length} shown
              </span>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 · Gallery
      ═══════════════════════════════════════════ */}
      <section
        id="gallery"
        className="relative w-full h-screen overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        aria-label="Gallery"
      >
        {/* DomeGallery fills the full section */}
        <DomeGallery
          overlayBlurColor="#000000"
          grayscale={false}
          imageBorderRadius="14px"
          openedImageBorderRadius="14px"
          openedImageWidth="360px"
          openedImageHeight="460px"
          fit={0.55}
          dragSensitivity={18}
          dragDampening={2}
        />

        {/* Section label overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 pt-8 pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-neutral-700" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 font-semibold">Gallery</span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-700 font-semibold">Drag to explore</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 · Contact
      ═══════════════════════════════════════════ */}
      <section
        id="contact"
        className="relative w-full min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 pt-24 pb-16 overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        aria-label="Contact"
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Ambient glow — bottom center */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse at bottom, rgba(34,211,238,0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)" }}
        />

        {/* ── Top: section label ── */}
        <ScrollReveal variant="fade-right" delay={0.1} className="relative z-10">
          <div className="flex items-center gap-4 mb-0">
            <div className="w-8 h-px bg-neutral-700" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 font-semibold">Contact</span>
          </div>
        </ScrollReveal>

        {/* ── Center: main CTA ── */}
        <div className="relative z-10 flex flex-col items-center text-center gap-10 my-auto py-16">
          <ScrollReveal variant="fade-up" delay={0.2}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-semibold">
              Let&apos;s make something
            </p>
          </ScrollReveal>

          {/* Giant headline CTA */}
          <ScrollReveal variant="clip-up" delay={0.3}>
            <a
              href="mailto:hello@yoursite.com"
              className="group cursor-target block"
              aria-label="Send an email"
            >
              <h2
                className="text-[clamp(3rem,10vw,11rem)] font-extralight text-white leading-none tracking-[-0.04em] transition-colors duration-500 group-hover:text-neutral-300"
                style={{ letterSpacing: "-0.04em" }}
              >
                <ScrambleText text="Say hello." chars="upperAndLowerCase" duration={1.4} delay={0.1} repeat />
              </h2>
              {/* Underline that grows on hover */}
              <div className="mt-2 h-px w-0 group-hover:w-full bg-neutral-600 transition-all duration-700 mx-auto" />
            </a>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.4}>
            <p className="text-sm text-neutral-600 font-light max-w-xs leading-relaxed">
              <ScrambleText text="Open to new projects, collaborations, and interesting conversations." chars="lowerCase" duration={1.2} delay={0.4} />
            </p>
          </ScrollReveal>

          {/* Social links row */}
          <ScrollReveal variant="fade-up" delay={0.5}>
            <div className="flex items-center gap-8 mt-2">
              {[
                { label: "Email", href: "mailto:hello@yoursite.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "Twitter", href: "https://twitter.com" },
                { label: "Dribbble", href: "https://dribbble.com" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group cursor-target flex flex-col items-center gap-1.5"
                >
                  <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-semibold group-hover:text-white transition-colors duration-300">
                    {link.label}
                  </span>
                  <div className="w-0 h-px bg-neutral-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* ── Bottom: footer bar ── */}
        <ScrollReveal variant="fade-up" delay={0.6} className="relative z-10 w-full">
          <div className="relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-t border-neutral-900 pt-8 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-light text-neutral-600">
                hello@yoursite.com
              </span>
              <span className="text-[10px] text-neutral-800 font-mono">
                Available for freelance — Q3 2025
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-800 font-medium">
                Based in Nairobi, KE
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-700 font-medium">
                  Available
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
