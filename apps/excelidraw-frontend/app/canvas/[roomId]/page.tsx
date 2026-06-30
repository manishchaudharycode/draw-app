"use client";

import { useEffect, useRef } from "react";
import { initDraw } from "@/app/draw";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanup = initDraw(canvas);

    return () => cleanup?.();
  }, []);

  return (
    <div className="h-screen w-screen">
      <canvas ref={canvasRef} className="h-screen w-screen" />
    </div>
  );
}
