"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Zap,
  Paintbrush,
  Activity,
  Layers,
  Cpu,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
  Monitor,
} from "lucide-react";

// Dynamically import ThreeCanvas to prevent server-side rendering errors with WebGL/Three.js
const ThreeCanvas = dynamic(() => import("./ThreeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-sm font-medium text-slate-400">Loading WebGL Scene...</span>
      </div>
    </div>
  ),
});

const PRESET_COLORS = [
  { name: "Indigo Nebula", hex: "#6366f1" },
  { name: "Emerald Cyber", hex: "#10b981" },
  { name: "Rose Quartz", hex: "#f43f5e" },
  { name: "Amber Flame", hex: "#f59e0b" },
  { name: "Cyan Void", hex: "#06b6d4" },
];

export default function Dashboard() {
  const [color, setColor] = useState("#6366f1");
  const [speed, setSpeed] = useState(1);
  const [shape, setShape] = useState<"torusKnot" | "icosahedron" | "sphere">("torusKnot");
  const [wireframe, setWireframe] = useState(false);
  const [distortion, setDistortion] = useState(0.3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-pink-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Antigravity 3D Playground
              </h1>
              <p className="text-xs text-indigo-400 font-medium">Next.js 16 + Tailwind v4 + Framer Motion + R3F</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: 3D view and live metrics */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Main 3D Canvas */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative">
              <ThreeCanvas
                color={color}
                speed={speed}
                shape={shape}
                wireframe={wireframe}
                distortion={distortion}
              />
              <div className="absolute top-4 left-4 bg-slate-950/70 border border-slate-800/80 backdrop-blur-md py-1.5 px-3 rounded-full text-xs font-semibold flex items-center gap-2 text-indigo-300">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                Interactive Orbit Control Enabled
              </div>
            </div>
          </div>

          {/* Quick Metrics / Status Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Material Color",
                val: color,
                icon: Paintbrush,
                colorClass: "text-indigo-400",
              },
              {
                label: "Rotation Speed",
                val: `${speed.toFixed(1)}x`,
                icon: Activity,
                colorClass: "text-emerald-400",
              },
              {
                label: "Vertex Mode",
                val: wireframe ? "Wireframe" : "Solid Mesh",
                icon: Layers,
                colorClass: "text-pink-400",
              },
            ].map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{metric.label}</span>
                  <metric.icon className={`w-4 h-4 ${metric.colorClass}`} />
                </div>
                <span className="text-sm sm:text-base font-bold text-white mt-1 font-mono tracking-tight">
                  {metric.val}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Right column: Interactive Controls panel */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-6"
          >
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Sliders className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-white">Visual Settings</h2>
            </div>

            {/* Shape Select */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Geometry Shape</span>
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {(["torusKnot", "icosahedron", "sphere"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`relative py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 capitalize ${
                      shape === s
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {s === "torusKnot" ? "Torus Knot" : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Select */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Color Palette</span>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => setColor(preset.hex)}
                    className="relative flex items-center justify-center p-0.5 rounded-full border border-transparent hover:border-slate-500 transition-all duration-200"
                  >
                    <span
                      className="w-7 h-7 rounded-full block border border-black/20"
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                    {color === preset.hex && (
                      <motion.span
                        layoutId="activeColor"
                        className="absolute -inset-1 rounded-full border-2 border-indigo-500 pointer-events-none"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </button>
                ))}
                
                {/* Custom Color Input */}
                <div className="relative flex items-center justify-center p-0.5 rounded-full border border-slate-800">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-7 h-7 rounded-full overflow-hidden border border-black/20 cursor-pointer p-0 bg-transparent"
                    title="Custom Color"
                  />
                </div>
              </div>
            </div>

            {/* Rotation Speed Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Rotation Velocity</span>
                <span className="text-indigo-400 font-mono font-bold">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-slate-800/80"
              />
            </div>

            {/* Distortion Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Mesh Distortion</span>
                <span className="text-indigo-400 font-mono font-bold">{(distortion * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={distortion}
                onChange={(e) => setDistortion(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-slate-800/80"
              />
            </div>

            {/* Wireframe Toggle */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4.5 h-4.5 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-200">Wireframe Render</span>
                  <span className="text-[10px] text-slate-500">Show geometry polygons</span>
                </div>
              </div>
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${
                  wireframe ? "bg-indigo-600 justify-end" : "bg-slate-800 justify-start"
                }`}
              >
                <motion.div
                  layout
                  className="w-4 h-4 bg-white rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </motion.div>

          {/* Technology Stack Details info card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/10 border border-slate-900/80 rounded-2xl p-5 text-xs text-slate-400 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <Zap className="w-4 h-4 text-amber-500" />
              About This Template
            </div>
            <p className="leading-relaxed">
              This playground demonstrates seamless integration between client-side Three.js components and React state.
              Changing the dashboard sliders triggers state updates, which are directly pushed into the 3D Canvas context.
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800/60 font-mono">React Three Fiber</span>
              <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800/60 font-mono">Framer Motion</span>
              <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800/60 font-mono">Lucide React</span>
              <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800/60 font-mono">Tailwind v4</span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-auto py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Antigravity Dev Environment.</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>WebGL Hardware Acceleration Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
