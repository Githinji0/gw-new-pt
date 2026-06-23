"use client";

import React, { useRef } from "react";
import { motion, useInView, Variant } from "framer-motion";

export type ScrollRevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "blur-in"
  | "clip-up";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  staggerIndex?: number;
  staggerStep?: number;
}

const revealVariants = {
  hidden: (variant: ScrollRevealVariant) => {
    switch (variant) {
      case "fade-up":
        return { opacity: 0, y: 40 };
      case "fade-down":
        return { opacity: 0, y: -40 };
      case "fade-left":
        return { opacity: 0, x: 40 };
      case "fade-right":
        return { opacity: 0, x: -40 };
      case "zoom-in":
        return { opacity: 0, scale: 0.95 };
      case "blur-in":
        return { opacity: 0, filter: "blur(10px)", y: 20 };
      case "clip-up":
        return { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 30 };
      default:
        return { opacity: 0, y: 40 };
    }
  },
  visible: (variant: ScrollRevealVariant) => {
    const base: Record<string, any> = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    };

    if (variant === "clip-up") {
      base.clipPath = "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)";
    }

    return base;
  },
};

export default function ScrollReveal({
  children,
  variant = "fade-up",
  duration = 0.8,
  delay = 0,
  threshold = 0.15,
  once = true,
  className = "",
  staggerIndex = 0,
  staggerStep = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  const computedDelay = delay + staggerIndex * staggerStep;

  // Premium easing curve (similar to power3/power4 out)
  const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        custom={variant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={revealVariants}
        transition={{
          duration,
          delay: computedDelay,
          ease: variant === "clip-up" ? ([0.25, 1, 0.5, 1] as [number, number, number, number]) : premiumEase,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
