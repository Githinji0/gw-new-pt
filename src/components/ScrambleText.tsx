"use client";

import { useEffect, useRef, ElementType } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

interface ScrambleTextProps {
  text: string;
  /** HTML tag to render, defaults to "span" */
  as?: ElementType;
  className?: string;
  /** Scramble character set — "upperCase" | "lowerCase" | "upperAndLowerCase" | custom string */
  chars?: string;
  /** Total tween duration in seconds */
  duration?: number;
  /** Delay before scramble starts (seconds) */
  delay?: number;
  /** How long scrambled chars stay before revealing (seconds) */
  revealDelay?: number;
  /** Whether to re-trigger each time the element enters the viewport */
  repeat?: boolean;
}

export default function ScrambleText({
  text,
  as: Tag = "span",
  className,
  chars = "lowerCase",
  duration = 1.2,
  delay = 0,
  revealDelay = 0.2,
  repeat = false,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Always keep the real text in the DOM so layout is stable.
    // We hide it visually before animating, then reveal via scramble.
    el.textContent = text;

    const play = () => {
      if (tweenRef.current) tweenRef.current.kill();

      // Hide without changing layout (visibility, not display/textContent)
      gsap.set(el, { visibility: "hidden" });

      tweenRef.current = gsap.to(el, {
        delay,
        duration,
        visibility: "visible",
        scrambleText: {
          // Scramble back to the original text that's already in the element
          text: "{original}",
          chars,
          revealDelay,
          tweenLength: false,
          speed: 0.5,
        },
        ease: "none",
      });
    };

    // threshold 0.5 — wait until element is well into view before triggering.
    // This avoids firing during mid-scroll-snap transitions.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayed.current || repeat) {
              hasPlayed.current = true;
              play();
            }
          } else if (repeat) {
            // Reset so it fires again next time
            hasPlayed.current = false;
            gsap.set(el, { visibility: "hidden" });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      tweenRef.current?.kill();
      gsap.set(el, { clearProps: "visibility" });
    };
  }, [text, chars, duration, delay, revealDelay, repeat]);

  const Component = Tag as "span";
  return (
    <Component
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={className}
      // Render text in DOM from the start for stable layout & SSR
      style={{ visibility: "hidden" }}
    >
      {text}
    </Component>
  );
}
