"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useGesture } from "@use-gesture/react";
import "./DomeGallery.css";

/* ------------------------------------------------------------------ */
/* Types                                                                 */
/* ------------------------------------------------------------------ */
type ImageInput = string | { src: string; alt?: string };

interface NormalizedImage {
  src: string;
  alt: string;
}

interface DomeItem extends NormalizedImage {
  x: number;
  y: number;
  sizeX: number;
  sizeY: number;
}

interface OriginalPos {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface DomeGalleryProps {
  images?: ImageInput[];
  fit?: number;
  fitBasis?: "auto" | "min" | "max" | "width" | "height";
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
}

/* ------------------------------------------------------------------ */
/* Defaults                                                              */
/* ------------------------------------------------------------------ */
const DEFAULT_IMAGES: ImageInput[] = [
  { src: "https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop", alt: "Abstract art" },
  { src: "https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop", alt: "Modern sculpture" },
  { src: "https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop", alt: "Digital artwork" },
  { src: "https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop", alt: "Contemporary art" },
  { src: "https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop", alt: "Geometric pattern" },
  { src: "https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop", alt: "Textured surface" },
];

/* ------------------------------------------------------------------ */
/* Pure helpers                                                          */
/* ------------------------------------------------------------------ */
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el: HTMLElement, name: string, fallback: number): number => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool: ImageInput[], seg: number): DomeItem[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs  = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) return coords.map((c) => ({ ...c, src: "", alt: "" }));

  const normalized: NormalizedImage[] = pool.map((img) =>
    typeof img === "string" ? { src: img, alt: "" } : { src: img.src ?? "", alt: img.alt ?? "" }
  );

  const used: NormalizedImage[] = Array.from({ length: totalSlots }, (_, i) => normalized[i % normalized.length]);

  for (let i = 1; i < used.length; i++) {
    if (used[i].src === used[i - 1].src) {
      for (let j = i + 1; j < used.length; j++) {
        if (used[j].src !== used[i].src) {
          [used[i], used[j]] = [used[j], used[i]];
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({ ...c, src: used[i].src, alt: used[i].alt }));
}

function computeItemBaseRotation(
  offsetX: number,
  offsetY: number,
  sizeX: number,
  sizeY: number,
  segments: number
) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

/* ------------------------------------------------------------------ */
/* Component                                                             */
/* ------------------------------------------------------------------ */
export default function DomeGallery({
  images            = DEFAULT_IMAGES,
  fit               = 0.5,
  fitBasis          = "auto",
  minRadius         = 600,
  maxRadius         = Infinity,
  padFactor         = 0.25,
  overlayBlurColor  = "#120F17",
  maxVerticalRotationDeg = 5,
  dragSensitivity   = 20,
  enlargeTransitionMs    = 300,
  segments          = 35,
  dragDampening     = 2,
  openedImageWidth  = "250px",
  openedImageHeight = "350px",
  imageBorderRadius = "30px",
  openedImageBorderRadius = "30px",
  grayscale         = true,
}: DomeGalleryProps) {
  const rootRef    = useRef<HTMLDivElement>(null);
  const mainRef    = useRef<HTMLDivElement>(null);
  const sphereRef  = useRef<HTMLDivElement>(null);
  const frameRef   = useRef<HTMLDivElement>(null);
  const viewerRef  = useRef<HTMLDivElement>(null);
  const scrimRef   = useRef<HTMLDivElement>(null);

  const focusedElRef           = useRef<HTMLElement | null>(null);
  const originalTilePositionRef = useRef<OriginalPos | null>(null);

  const rotationRef    = useRef({ x: 0, y: 0 });
  const startRotRef    = useRef({ x: 0, y: 0 });
  const startPosRef    = useRef<{ x: number; y: number } | null>(null);
  const draggingRef    = useRef(false);
  const movedRef       = useRef(false);
  const inertiaRAF     = useRef<number | null>(null);
  const openingRef     = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt  = useRef(0);
  const lockedRadiusRef = useRef<number | null>(null);
  const scrollLockedRef = useRef(false);

  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add("dg-scroll-lock");
  }, []);

  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute("data-enlarging") === "true") return;
    scrollLockedRef.current = false;
    document.body.classList.remove("dg-scroll-lock");
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  /* ResizeObserver */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);
      const aspect = w / h;

      let basis: number;
      switch (fitBasis) {
        case "min":    basis = minDim; break;
        case "max":    basis = maxDim; break;
        case "width":  basis = w; break;
        case "height": basis = h; break;
        default:       basis = aspect >= 1.3 ? w : minDim;
      }

      let radius = basis * fit;
      radius = Math.min(radius, h * 1.35);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty("--radius", `${lockedRadiusRef.current}px`);
      root.style.setProperty("--viewer-pad", `${viewerPad}px`);
      root.style.setProperty("--overlay-blur-color", overlayBlurColor);
      root.style.setProperty("--tile-radius", imageBorderRadius);
      root.style.setProperty("--enlarge-radius", openedImageBorderRadius);
      root.style.setProperty("--image-filter", grayscale ? "grayscale(1)" : "none");
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector<HTMLElement>(".enlarge");
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR  = mainRef.current.getBoundingClientRect();

        if (openedImageWidth && openedImageHeight) {
          const tmp = document.createElement("div");
          tmp.style.cssText = `position:absolute;width:${openedImageWidth};height:${openedImageHeight};visibility:hidden;`;
          document.body.appendChild(tmp);
          const tmpRect = tmp.getBoundingClientRect();
          document.body.removeChild(tmp);
          enlargedOverlay.style.left = `${frameR.left - mainR.left + (frameR.width - tmpRect.width) / 2}px`;
          enlargedOverlay.style.top  = `${frameR.top - mainR.top + (frameR.height - tmpRect.height) / 2}px`;
        } else {
          enlargedOverlay.style.left   = `${frameR.left - mainR.left}px`;
          enlargedOverlay.style.top    = `${frameR.top - mainR.top}px`;
          enlargedOverlay.style.width  = `${frameR.width}px`;
          enlargedOverlay.style.height = `${frameR.height}px`;
        }
      }
    });

    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius, openedImageBorderRadius, openedImageWidth, openedImageHeight]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback((vx: number, vy: number) => {
    const MAX_V = 1.4;
    let vX = clamp(vx, -MAX_V, MAX_V) * 80;
    let vY = clamp(vy, -MAX_V, MAX_V) * 80;
    let frames = 0;
    const d = clamp(dragDampening ?? 0.6, 0, 1);
    const frictionMul  = 0.94 + 0.055 * d;
    const stopThreshold = 0.015 - 0.01 * d;
    const maxFrames    = Math.round(90 + 270 * d);

    const step = () => {
      vX *= frictionMul;
      vY *= frictionMul;
      if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) { inertiaRAF.current = null; return; }
      if (++frames > maxFrames) { inertiaRAF.current = null; return; }
      const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
      rotationRef.current = { x: nextX, y: nextY };
      applyTransform(nextX, nextY);
      inertiaRAF.current = requestAnimationFrame(step);
    };
    stopInertia();
    inertiaRAF.current = requestAnimationFrame(step);
  }, [dragDampening, maxVerticalRotationDeg, stopInertia]);

  /* Gesture */
  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();
        const evt = event as MouseEvent;
        draggingRef.current   = true;
        movedRef.current      = false;
        startRotRef.current   = { ...rotationRef.current };
        startPosRef.current   = { x: evt.clientX, y: evt.clientY };
      },
      onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
        const evt = event as MouseEvent;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;

        if (!movedRef.current && dxTotal * dxTotal + dyTotal * dyTotal > 16) {
          movedRef.current = true;
        }

        const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);
        if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }

        if (last) {
          draggingRef.current = false;
          let [vMagX, vMagY] = velocity as [number, number];
          const [dirX, dirY] = direction as [number, number];
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;
          if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement as [number, number];
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      },
    },
    { target: mainRef as React.RefObject<EventTarget>, eventOptions: { passive: true } }
  );

  /* Scrim close handler */
  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;

    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent  = el.parentElement as HTMLElement;
      const overlay = viewerRef.current?.querySelector<HTMLElement>(".enlarge");
      if (!overlay) return;

      const refDiv = parent.querySelector<HTMLElement>(".item__image--reference");
      const originalPos = originalTilePositionRef.current;

      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty("--rot-y-delta", "0deg");
        parent.style.setProperty("--rot-x-delta", "0deg");
        el.style.visibility = "";
        (el as HTMLElement).style.zIndex = "0";
        focusedElRef.current = null;
        rootRef.current?.removeAttribute("data-enlarging");
        openingRef.current = false;
        unlockScroll();
        return;
      }

      const currentRect = overlay.getBoundingClientRect();
      const rootRect    = rootRef.current!.getBoundingClientRect();

      const overlayRel = {
        left: currentRect.left - rootRect.left,
        top:  currentRect.top  - rootRect.top,
        width:  currentRect.width,
        height: currentRect.height,
      };
      const origRel = {
        left: originalPos.left - rootRect.left,
        top:  originalPos.top  - rootRect.top,
        width:  originalPos.width,
        height: originalPos.height,
      };

      const animOverlay = document.createElement("div");
      animOverlay.className = "enlarge-closing";
      animOverlay.style.cssText = `position:absolute;left:${overlayRel.left}px;top:${overlayRel.top}px;width:${overlayRel.width}px;height:${overlayRel.height}px;z-index:9999;border-radius:var(--enlarge-radius,32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${enlargeTransitionMs}ms ease-out;pointer-events:none;margin:0;transform:none;`;

      const origImg = overlay.querySelector("img");
      if (origImg) {
        const img = origImg.cloneNode() as HTMLImageElement;
        img.style.cssText = "width:100%;height:100%;object-fit:cover;";
        animOverlay.appendChild(img);
      }

      overlay.remove();
      rootRef.current!.appendChild(animOverlay);
      void animOverlay.getBoundingClientRect();

      requestAnimationFrame(() => {
        animOverlay.style.left    = `${origRel.left}px`;
        animOverlay.style.top     = `${origRel.top}px`;
        animOverlay.style.width   = `${origRel.width}px`;
        animOverlay.style.height  = `${origRel.height}px`;
        animOverlay.style.opacity = "0";
      });

      const cleanup = () => {
        animOverlay.remove();
        originalTilePositionRef.current = null;
        if (refDiv) refDiv.remove();
        parent.style.transition = "none";
        el.style.transition     = "none";
        parent.style.setProperty("--rot-y-delta", "0deg");
        parent.style.setProperty("--rot-x-delta", "0deg");
        requestAnimationFrame(() => {
          el.style.visibility = "";
          el.style.opacity    = "0";
          (el as HTMLElement).style.zIndex = "0";
          focusedElRef.current = null;
          rootRef.current?.removeAttribute("data-enlarging");
          requestAnimationFrame(() => {
            parent.style.transition = "";
            el.style.transition     = "opacity 300ms ease-out";
            requestAnimationFrame(() => {
              el.style.opacity = "1";
              setTimeout(() => {
                el.style.transition = "";
                el.style.opacity    = "";
                openingRef.current  = false;
                if (!draggingRef.current && rootRef.current?.getAttribute("data-enlarging") !== "true") {
                  document.body.classList.remove("dg-scroll-lock");
                }
              }, 300);
            });
          });
        });
      };

      animOverlay.addEventListener("transitionend", cleanup, { once: true });
    };

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    scrim.addEventListener("click", close);
    window.addEventListener("keydown", onKey);
    return () => {
      scrim.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [enlargeTransitionMs, unlockScroll]);

  /* Open image */
  const openItemFromElement = useCallback((el: HTMLElement) => {
    if (openingRef.current) return;
    openingRef.current = true;
    openStartedAtRef.current = performance.now();
    lockScroll();

    const parent = el.parentElement as HTMLElement;
    focusedElRef.current = el;
    el.setAttribute("data-focused", "true");

    const offsetX = getDataNumber(parent, "offsetX", 0);
    const offsetY = getDataNumber(parent, "offsetY", 0);
    const sizeX   = getDataNumber(parent, "sizeX", 2);
    const sizeY   = getDataNumber(parent, "sizeY", 2);

    const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
    const parentY   = normalizeAngle(parentRot.rotateY);
    const globalY   = normalizeAngle(rotationRef.current.y);
    let rotY = -(parentY + globalY) % 360;
    if (rotY < -180) rotY += 360;
    const rotX = -parentRot.rotateX - rotationRef.current.x;

    parent.style.setProperty("--rot-y-delta", `${rotY}deg`);
    parent.style.setProperty("--rot-x-delta", `${rotX}deg`);

    const refDiv = document.createElement("div");
    refDiv.className = "item__image item__image--reference";
    refDiv.style.opacity   = "0";
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
    parent.appendChild(refDiv);
    void refDiv.offsetHeight;

    const tileR  = refDiv.getBoundingClientRect();
    const mainR  = mainRef.current?.getBoundingClientRect();
    const frameR = frameRef.current?.getBoundingClientRect();

    if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
      openingRef.current = false;
      focusedElRef.current = null;
      parent.removeChild(refDiv);
      unlockScroll();
      return;
    }

    originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
    el.style.visibility = "hidden";
    (el as HTMLElement).style.zIndex = "0";

    const overlay = document.createElement("div");
    overlay.className = "enlarge";
    overlay.style.cssText = `position:absolute;left:${frameR.left - mainR.left}px;top:${frameR.top - mainR.top}px;width:${frameR.width}px;height:${frameR.height}px;opacity:0;z-index:30;will-change:transform,opacity;transform-origin:top left;transition:transform ${enlargeTransitionMs}ms ease,opacity ${enlargeTransitionMs}ms ease;`;

    const rawSrc = parent.dataset["src"] || el.querySelector("img")?.src || "";
    const img = document.createElement("img");
    img.src = rawSrc;
    overlay.appendChild(img);
    viewerRef.current!.appendChild(overlay);

    const tx0 = tileR.left - frameR.left;
    const ty0 = tileR.top  - frameR.top;
    const sx0 = Math.max(0.001, tileR.width  / frameR.width);
    const sy0 = Math.max(0.001, tileR.height / frameR.height);
    overlay.style.transform = `translate(${tx0}px,${ty0}px) scale(${sx0},${sy0})`;

    setTimeout(() => {
      if (!overlay.parentElement) return;
      overlay.style.opacity   = "1";
      overlay.style.transform = "translate(0px,0px) scale(1,1)";
      rootRef.current?.setAttribute("data-enlarging", "true");
    }, 16);

    if (openedImageWidth || openedImageHeight) {
      const onFirstEnd = (ev: TransitionEvent) => {
        if (ev.propertyName !== "transform") return;
        overlay.removeEventListener("transitionend", onFirstEnd);
        const prevTrans = overlay.style.transition;
        overlay.style.transition = "none";
        const tw = openedImageWidth  || `${frameR.width}px`;
        const th = openedImageHeight || `${frameR.height}px`;
        overlay.style.width  = tw;
        overlay.style.height = th;
        const newRect = overlay.getBoundingClientRect();
        overlay.style.width  = `${frameR.width}px`;
        overlay.style.height = `${frameR.height}px`;
        void overlay.offsetWidth;
        overlay.style.transition = `left ${enlargeTransitionMs}ms ease,top ${enlargeTransitionMs}ms ease,width ${enlargeTransitionMs}ms ease,height ${enlargeTransitionMs}ms ease`;
        const cl = frameR.left - mainR.left + (frameR.width  - newRect.width)  / 2;
        const ct = frameR.top  - mainR.top  + (frameR.height - newRect.height) / 2;
        requestAnimationFrame(() => {
          overlay.style.left   = `${cl}px`;
          overlay.style.top    = `${ct}px`;
          overlay.style.width  = tw;
          overlay.style.height = th;
        });
        const cleanup2 = () => { overlay.removeEventListener("transitionend", cleanup2); overlay.style.transition = prevTrans; };
        overlay.addEventListener("transitionend", cleanup2, { once: true });
      };
      overlay.addEventListener("transitionend", onFirstEnd);
    }
  }, [enlargeTransitionMs, lockScroll, openedImageHeight, openedImageWidth, segments, unlockScroll]);

  const onTileClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingRef.current || movedRef.current) return;
    if (performance.now() - lastDragEndAt.current < 80) return;
    if (openingRef.current) return;
    openItemFromElement(e.currentTarget);
  }, [openItemFromElement]);

  const onTilePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") return;
    if (draggingRef.current || movedRef.current) return;
    if (performance.now() - lastDragEndAt.current < 80) return;
    if (openingRef.current) return;
    openItemFromElement(e.currentTarget);
  }, [openItemFromElement]);

  useEffect(() => {
    return () => { document.body.classList.remove("dg-scroll-lock"); };
  }, []);

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{
        "--segments-x": segments,
        "--segments-y": segments,
        "--overlay-blur-color": overlayBlurColor,
        "--tile-radius": imageBorderRadius,
        "--enlarge-radius": openedImageBorderRadius,
        "--image-filter": grayscale ? "grayscale(1)" : "none",
      } as React.CSSProperties}
    >
      {/* sphere-main is a div (not main) to avoid nested <main> elements */}
      <div ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                style={{
                  "--offset-x":    it.x,
                  "--offset-y":    it.y,
                  "--item-size-x": it.sizeX,
                  "--item-size-y": it.sizeY,
                } as React.CSSProperties}
              >
                <div
                  className="item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || "Open image"}
                  onClick={onTileClick}
                  onPointerUp={onTilePointerUp}
                >
                  <img src={it.src} draggable={false} alt={it.alt} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />

        <div className="viewer" ref={viewerRef}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="frame" />
        </div>
      </div>
    </div>
  );
}
