"use client";

import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setClicked = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";

    const handleMouseDown = (e: MouseEvent) => {
      setClicked.current = true;
      startX.current = e.offsetX;   
      startY.current = e.offsetY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!setClicked.current) return;

      const width = e.offsetX - startX.current;
      const height = e.offsetY - startY.current;

      // Clear previous rectangle
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw new rectangle
      ctx.strokeRect(startX.current, startY.current, width, height);
    };

    const handleMouseUp = () => {
      setClicked.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  return (
    <div className="h-screen w-screen  ">
      <canvas ref={canvasRef} className="h-screen w-screen" />
    </div>
  );
}
