"use client";

import React, { useRef, useEffect, useCallback } from "react";

const TRAIL_LEN = 10;
const SCALE = 0.25; // mask canvas at 25% resolution — key perf win

export default function ImageReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const trail = useRef<{ x: number; y: number }[]>([]);
  const targetTilt = useRef({ rx: 0, ry: 0 });
  const currentTilt = useRef({ rx: 0, ry: 0 });
  const hovered = useRef(false);
  const rafId = useRef<number>(0);

  const face2 = useRef<HTMLImageElement | null>(null);
  const maskCvs = useRef<HTMLCanvasElement | null>(null);
  const dims = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const img = new window.Image();
    img.src = "/face2.jpg";
    img.onload = () => { face2.current = img; };
    maskCvs.current = document.createElement("canvas");
  }, []);

  useEffect(() => {
    const sync = () => {
      const el = containerRef.current;
      const cvs = canvasRef.current;
      const mc = maskCvs.current;
      if (!el || !cvs || !mc) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      dims.current = { w, h };
      cvs.width = w;
      cvs.height = h;
      mc.width = Math.ceil(w * SCALE);
      mc.height = Math.ceil(h * SCALE);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const loop = useCallback(() => {
    const lerp = 0.1;
    const { w, h } = dims.current;

    current.current.x += (target.current.x - current.current.x) * lerp;
    current.current.y += (target.current.y - current.current.y) * lerp;

    if (hovered.current) {
      trail.current.unshift({ x: current.current.x, y: current.current.y });
      if (trail.current.length > TRAIL_LEN) trail.current.length = TRAIL_LEN;
    } else if (trail.current.length > 0) {
      trail.current.pop();
    }

    const trx = hovered.current ? targetTilt.current.rx : 0;
    const tryy = hovered.current ? targetTilt.current.ry : 0;
    currentTilt.current.rx += (trx - currentTilt.current.rx) * 0.06;
    currentTilt.current.ry += (tryy - currentTilt.current.ry) * 0.06;

    const cvs = canvasRef.current;
    const mc = maskCvs.current;
    const img = face2.current;

    if (cvs && mc && img && w > 0 && trail.current.length > 0) {
      const ctx = cvs.getContext("2d")!;
      const mctx = mc.getContext("2d")!;
      const mw = mc.width;
      const mh = mc.height;

      // 1. Draw blob circles on small mask canvas
      mctx.clearRect(0, 0, mw, mh);
      mctx.filter = "blur(8px)"; // blur is smaller because canvas is smaller
      mctx.fillStyle = "#fff";
      for (let i = 0; i < trail.current.length; i++) {
        const t = 1 - i / trail.current.length;
        const r = (20 + t * 45) * SCALE; // 65→20 in full-res px
        mctx.beginPath();
        mctx.arc(trail.current[i].x * SCALE, trail.current[i].y * SCALE, r, 0, Math.PI * 2);
        mctx.fill();
      }
      mctx.filter = "none";

      // 2. Threshold — runs on tiny canvas so very fast
      const idata = mctx.getImageData(0, 0, mw, mh);
      const d = idata.data;
      for (let i = 3; i < d.length; i += 4) {
        d[i] = d[i] > 100 ? 255 : 0;
      }
      mctx.putImageData(idata, 0, 0);

      // 3. Slight soften
      mctx.save();
      mctx.filter = "blur(2px)";
      mctx.drawImage(mc, 0, 0);
      mctx.restore();

      // 4. Draw face2 on visible canvas
      ctx.clearRect(0, 0, w, h);
      const imgR = img.width / img.height;
      const cvsR = w / h;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgR > cvsR) { sw = img.height * cvsR; sx = (img.width - sw) / 2; }
      else { sh = img.width / cvsR; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

      // 5. Composite: clip face2 to blob (scale mask up)
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mc, 0, 0, mw, mh, 0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    } else if (cvs && trail.current.length === 0) {
      cvs.getContext("2d")!.clearRect(0, 0, w, h);
    }

    if (followerRef.current) {
      followerRef.current.style.left = `${current.current.x}px`;
      followerRef.current.style.top = `${current.current.y}px`;
      followerRef.current.style.opacity = hovered.current ? "1" : "0";
    }

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

  const onEnter = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.current = { x, y };
    current.current = { x, y };
    trail.current = [{ x, y }];
    hovered.current = true;
    updateTilt(x, y, rect.width, rect.height);
  };

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.current.x = x;
    target.current.y = y;
    updateTilt(x, y, rect.width, rect.height);
  };

  const onLeave = () => { hovered.current = false; };

  const updateTilt = (x: number, y: number, w: number, h: number) => {
    const max = 6;
    targetTilt.current.ry = ((x / w - 0.5) * 2) * max;
    targetTilt.current.rx = -((y / h - 0.5) * 2) * max;
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full h-full cursor-none select-none overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 20%, black 100%), linear-gradient(to bottom, black 0%, black 88%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%, black 100%), linear-gradient(to bottom, black 0%, black 88%, transparent 100%)",
        WebkitMaskComposite: "destination-in",
      }}
    >
      <div
        ref={innerRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <img
          src="/face1.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <div
          ref={followerRef}
          className="absolute w-5 h-5 rounded-full border border-white/40 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 transition-opacity duration-300"
          style={{ left: 0, top: 0 }}
        />
      </div>
    </div>
  );
}
