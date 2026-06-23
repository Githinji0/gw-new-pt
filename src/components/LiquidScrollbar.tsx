"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* Constants */
const PAD    = 60;   // px gap from top/bottom screen edge
const BLOB_R = 5.5;  // main blob base radius
const DRIP_R = 3.2;  // trailing drip radius
const CX     = 8;    // horizontal center of SVG
const W      = 16;   // SVG width

/* Compute available travel range */
const getRange = (vh: number) => vh - PAD * 2 - BLOB_R * 2;

/* Map a 0-1 progress value to a y pixel position */
const toY = (p: number, vh: number) => PAD + BLOB_R + p * getRange(vh);

export default function LiquidScrollbar() {
  const thumbRef = useRef<SVGCircleElement>(null);
  const dripRef  = useRef<SVGCircleElement>(null);
  const glowRef  = useRef<SVGCircleElement>(null);

  const [vh, setVh]               = useState(0);
  const [dots, setDots]           = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastY     = useRef(0);

  /* Resize */
  useEffect(() => {
    const set = () => setVh(window.innerHeight);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  /* Scroll logic */
  useEffect(() => {
    if (!vh) return;

    const main = document.querySelector("main") as HTMLElement | null;
    if (!main) return;

    /* Seed initial positions */
    const initY = toY(0, vh);
    gsap.set(thumbRef.current, { attr: { cy: initY, r: BLOB_R } });
    gsap.set(glowRef.current,  { attr: { cy: initY, r: BLOB_R } });
    gsap.set(dripRef.current,  { attr: { cy: initY + 20 } });
    lastY.current = initY;

    /* Section dot positions */
    const maxScroll = main.scrollHeight - main.clientHeight;
    const sections  = Array.from(main.querySelectorAll("section")) as HTMLElement[];
    setDots(sections.map((s) => toY(maxScroll > 0 ? s.offsetTop / maxScroll : 0, vh)));

    /* Scroll handler */
    const onScroll = () => {
      const max  = main.scrollHeight - main.clientHeight;
      const prog = max > 0 ? main.scrollTop / max : 0;
      const ty   = toY(prog, vh);

      /* Active section */
      const secIdx = sections.findIndex((s, i) => {
        const next = sections[i + 1] as HTMLElement | undefined;
        return (
          main.scrollTop >= s.offsetTop - 10 &&
          (!next || main.scrollTop < next.offsetTop - 10)
        );
      });
      if (secIdx !== -1) setActiveIdx(secIdx);

      /* Drip trails in direction of travel */
      const movingDown  = ty >= lastY.current;
      const dripTarget  = ty + (movingDown ? 22 : -22);
      lastY.current     = ty;

      /* Thumb fast + slight pulse */
      gsap.to([thumbRef.current, glowRef.current], {
        attr: { cy: ty, r: BLOB_R + 1.5 },
        duration: 0.1,
        ease: "power2.out",
        overwrite: true,
      });

      /* Drip elastic lag */
      gsap.to(dripRef.current, {
        attr: { cy: dripTarget },
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });

      /* After idle: restore blob shape and drip merges back */
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        gsap.to([thumbRef.current, glowRef.current], {
          attr: { r: BLOB_R },
          duration: 0.65,
          ease: "elastic.out(1.2, 0.45)",
        });
        gsap.to(dripRef.current, {
          attr: { cy: ty + (movingDown ? 8 : -8) },
          duration: 0.9,
          ease: "elastic.out(0.85, 0.35)",
        });
      }, 85);
    };

    main.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      main.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer.current);
    };
  }, [vh]);

  /* Click-to-scroll */
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const main = document.querySelector("main") as HTMLElement | null;
    if (!main) return;
    const rect   = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const p      = Math.max(0, Math.min(1, (clickY - PAD - BLOB_R) / getRange(vh)));
    main.scrollTo({ top: p * (main.scrollHeight - main.clientHeight), behavior: "smooth" });
  };

  if (!vh) return null;

  const sectionLabels = ["01", "02", "03", "04", "05"];

  return (
    <div
      aria-hidden
      className="fixed top-0 right-4 z-[60] flex items-center"
      style={{ width: W + 24, height: "100vh", pointerEvents: "none" }}
    >
      {/* Active section label */}
      <div
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2"
        style={{ pointerEvents: "none" }}
      >
        <span
          className="text-[8px] font-mono text-neutral-700 tracking-widest"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.2em" }}
        >
          {sectionLabels[activeIdx] ?? "01"}
        </span>
      </div>

      <svg
        width={W}
        height={vh}
        style={{ overflow: "visible", pointerEvents: "auto", cursor: "pointer", marginLeft: 8 }}
        onClick={handleClick}
      >
        <defs>
          {/* Gooey merge filter */}
          <filter id="liq-goo" x="-200%" y="-20%" width="500%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          {/* Outer glow filter */}
          <filter id="liq-glow" x="-400%" y="-400%" width="900%" height="900%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>

        {/* Track line */}
        <line x1={CX} y1={PAD} x2={CX} y2={vh - PAD} stroke="#1e1e1e" strokeWidth="1" />

        {/* Section dots */}
        {dots.map((y, i) => (
          <circle
            key={i}
            cx={CX}
            cy={y}
            r={i === activeIdx ? 2.2 : 1.5}
            fill={i === activeIdx ? "#404040" : "#242424"}
          />
        ))}

        {/* Cyan glow halo (blurred, behind) */}
        <g filter="url(#liq-glow)" opacity={0.45}>
          <circle ref={glowRef} cx={CX} cy={PAD + BLOB_R} r={BLOB_R} fill="#22d3ee" />
        </g>

        {/* Liquid gooey blobs (thumb + drip) */}
        <g filter="url(#liq-goo)">
          <circle ref={thumbRef} cx={CX} cy={PAD + BLOB_R} r={BLOB_R} fill="#22d3ee" />
          <circle ref={dripRef}  cx={CX} cy={PAD + BLOB_R + 20} r={DRIP_R} fill="#22d3ee" />
        </g>
      </svg>
    </div>
  );
}
