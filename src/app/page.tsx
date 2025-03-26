"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useEffect, useState } from "react";
import type { Scene as ThreeScene } from "three";

declare global {
  interface Window {
    currentScene?: ThreeScene;
  }
}

const DraggableBox = () => {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  const bind = useDrag(({ delta: [dx, dy], buttons }) => {
    if (buttons !== 1) return;

    const [x, y, z] = position;
    const nextX = x + dx * 0.01;
    const nextY = y - dy * 0.01;

    setPosition([nextX, nextY, z]);
  });

  return (
    <mesh
      position={position}
      // @ts-expect-error -- event is not typed correctly, but works
      onPointerDown={(event) => bind().onPointerDown?.(event)}
      // @ts-expect-error -- event is not typed correctly, but works
      onPointerMove={(event) => bind().onPointerMove?.(event)}
      // @ts-expect-error -- event is not typed correctly, but works
      onPointerUp={(event) => bind().onPointerUp?.(event)}
      name="MyBox"
    >
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const Scene = () => {
  const { scene } = useThree();

  useEffect(() => {
    window.currentScene = scene;
  }, [scene]);

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DraggableBox />
    </>
  );
};

export default function Home() {
  return (
    <main style={{ padding: "1rem" }}>
      <h1>Next.js + React-Three-Fiber + useGesture</h1>
      <Canvas style={{ width: "100%", height: "400px", background: "#ddd" }}>
        <Scene />
      </Canvas>
    </main>
  );
}
