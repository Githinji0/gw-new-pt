"use client";

import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

interface ImageRevealProps {
  blobType?: 'circle' | 'square';
  trailCount?: number;
  sizes?: number[];
  opacities?: number[];
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
}

export default function ImageReveal({
  blobType = 'circle',
  trailCount = 3,
  sizes = [60, 125, 75],
  opacities = [1, 1, 1],
  filterId = 'image-reveal-mask-filter',
  filterStdDeviation = 30,
  filterColorMatrixValues = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  fastEase = 'power3.out',
  slowEase = 'power1.out'
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(SVGCircleElement | null)[]>([]);
  const followerRef = useRef<HTMLDivElement>(null);

  const targetTilt = useRef({ rx: 0, ry: 0 });
  const currentTilt = useRef({ rx: 0, ry: 0 });
  const hovered = useRef(false);
  const rafId = useRef<number>(0);

  // 3D Perspective Tilt RAF loop
  const loop = useCallback(() => {
    const trx = hovered.current ? targetTilt.current.rx : 0;
    const tryy = hovered.current ? targetTilt.current.ry : 0;
    
    currentTilt.current.rx += (trx - currentTilt.current.rx) * 0.06;
    currentTilt.current.ry += (tryy - currentTilt.current.ry) * 0.06;

    if (innerRef.current) {
      const { rx, ry } = currentTilt.current;
      innerRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${hovered.current ? 1.03 : 1})`;
    }

    rafId.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [loop]);

  const updateTilt = (x: number, y: number, w: number, h: number) => {
    const max = 6;
    targetTilt.current.ry = ((x / w - 0.5) * 2) * max;
    targetTilt.current.rx = -((y / h - 0.5) * 2) * max;
  };

  const onEnter = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    hovered.current = true;
    updateTilt(x, y, rect.width, rect.height);

    // Make follower visible
    if (followerRef.current) {
      followerRef.current.style.opacity = "1";
      gsap.set(followerRef.current, { x, y });
    }

    // Instantly place and scale up all mask blobs to prevent flying in from offscreen
    blobsRef.current.forEach((el, i) => {
      if (!el) return;
      const targetR = sizes[i] ? sizes[i] / 2 : 30;
      gsap.killTweensOf(el);
      gsap.set(el, {
        attr: {
          cx: x,
          cy: y,
          r: targetR
        }
      });
    });
  };

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateTilt(x, y, rect.width, rect.height);

    // Position follower
    if (followerRef.current) {
      gsap.to(followerRef.current, {
        x: x,
        y: y,
        duration: fastDuration,
        ease: fastEase
      });
    }

    // Move the trailing blobs inside the SVG mask
    blobsRef.current.forEach((el, i) => {
      if (!el) return;
      const isLead = i === 0;
      const targetR = sizes[i] ? sizes[i] / 2 : 30;
      gsap.killTweensOf(el);
      gsap.to(el, {
        attr: {
          cx: x,
          cy: y,
          r: targetR
        },
        duration: isLead ? fastDuration : slowDuration,
        ease: isLead ? fastEase : slowEase
      });
    });
  };

  const onLeave = () => {
    hovered.current = false;

    // Fade out follower
    if (followerRef.current) {
      followerRef.current.style.opacity = "0";
    }

    // Shrink all mask blobs to 0 radius
    blobsRef.current.forEach((el) => {
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.to(el, {
        attr: { r: 0 },
        duration: 0.5,
        ease: "power2.out"
      });
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full h-full cursor-none select-none overflow-hidden"
    >
      <div
        ref={innerRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        {/* Render both portraits inside a single native SVG container */}
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          <defs>
            {useFilter && (
              <filter id={filterId}>
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
                <feColorMatrix in="blur" mode="matrix" values={filterColorMatrixValues} result="goo" />
              </filter>
            )}
            <mask id="image-reveal-mask" maskUnits="userSpaceOnUse">
              <g filter={useFilter ? `url(#${filterId})` : undefined}>
                {Array.from({ length: trailCount }).map((_, i) => (
                  <circle
                    key={i}
                    ref={el => {
                      blobsRef.current[i] = el;
                    }}
                    cx="-500"
                    cy="-500"
                    r="0"
                    fill="white"
                    style={{
                      opacity: opacities[i] !== undefined ? opacities[i] : 1,
                    }}
                  />
                ))}
              </g>
            </mask>
          </defs>

          {/* Underlay Image: without glasses */}
          <image
            href="/face1.jpg"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMin slice"
          />

          {/* Masked Overlay Image: with glasses */}
          <image
            href="/face2.jpg"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMin slice"
            mask="url(#image-reveal-mask)"
          />
        </svg>

        {/* Soft Vignette Overlay Gradients */}
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{ backgroundImage: "linear-gradient(to bottom, #000 0%, transparent 15%, transparent 85%, #000 100%)" }}
        />
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{ backgroundImage: "linear-gradient(to right, #000 0%, transparent 15%, transparent 85%, #000 100%)" }}
        />

        {/* Visual indicator follower ring */}
        <div
          ref={followerRef}
          className="absolute w-5 h-5 rounded-full border border-white/40 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 transition-opacity duration-300"
          style={{ left: 0, top: 0 }}
        />
      </div>
    </div>
  );
}
