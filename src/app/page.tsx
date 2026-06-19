"use client";

import ImageReveal from "@/components/LandoReveal";

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">

      {/* ── GRID: Left text / Right portrait ── */}
      <div className="relative z-10 w-full h-full flex">

        {/* ─── LEFT COLUMN: Typography ─── */}
        <div className="flex-1 flex flex-col justify-center pl-12 sm:pl-16 lg:pl-24 xl:pl-32 pr-8 relative z-20">

          {/* Achievement counters */}
          <div className="flex gap-10 lg:gap-14 mb-14">
            {[
              { value: "12+", label: "Years Experience" },
              { value: "86", label: "Projects Delivered" },
              { value: "40+", label: "Global Clients" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
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
          <h1 className="text-[clamp(2.5rem,6vw,7rem)] font-extralight text-white leading-[0.95] tracking-[-0.03em]">
            Creative
            <br />
            <span className="font-normal">Director</span>
            <br />
            <span className="text-neutral-500">&amp; Designer</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm text-neutral-500 mt-10 max-w-xs leading-relaxed font-light">
            Crafting premium digital experiences at the intersection of design,
            technology, and culture.
          </p>

          {/* CTA line */}
          <div className="mt-14 flex items-center gap-4">
            <div className="w-12 h-px bg-neutral-700" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-medium">
              Scroll to explore
            </span>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Portrait ─── */}
        <div className="w-[45vw] lg:w-[48vw] h-full flex-shrink-0 relative">
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
