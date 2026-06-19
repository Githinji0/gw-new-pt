"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

interface ThreeCanvasProps {
  color: string;
  speed: number;
  shape: "torusKnot" | "icosahedron" | "sphere";
  wireframe: boolean;
  distortion: number;
}

function AnimatedMesh({ color, speed, shape, wireframe, distortion }: ThreeCanvasProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow scale={1.2}>
      {shape === "torusKnot" && (
        <torusKnotGeometry args={[0.8, 0.25, 120, 16]} />
      )}
      {shape === "icosahedron" && (
        <icosahedronGeometry args={[1, 1]} />
      )}
      {shape === "sphere" && (
        <sphereGeometry args={[1, 64, 64]} />
      )}
      
      {distortion > 0 ? (
        <MeshDistortMaterial
          color={color}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={distortion * 0.4}
          speed={speed * 1.5}
          wireframe={wireframe}
        />
      ) : (
        <meshPhysicalMaterial
          color={color}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          transmission={0.3}
          thickness={0.5}
          wireframe={wireframe}
        />
      )}
    </mesh>
  );
}

export default function ThreeCanvas({
  color = "#8b5cf6",
  speed = 1,
  shape = "torusKnot",
  wireframe = false,
  distortion = 0.5,
}: Partial<ThreeCanvasProps>) {
  return (
    <div className="w-full h-full min-h-[350px] relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        <Float speed={speed * 2} rotationIntensity={1.5} floatIntensity={1.5}>
          <AnimatedMesh
            color={color}
            speed={speed}
            shape={shape}
            wireframe={wireframe}
            distortion={distortion}
          />
        </Float>
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={1} />
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
