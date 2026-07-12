"use client";

import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import {
  MousePointer2,
  Hand,
  Square,
  Circle,
  Diamond,
  Triangle,
  ArrowRight,
  Pencil,
  Eraser,
  Type,
  Image,
  Minus,
} from "lucide-react";

type Shape =
  | "MousePointer2"
  | "Hand"
  | "Square"
  | "Circle"
  | "Diamond"
  | "Triangle"
  | "ArrowRight"
  | "Pencil"
  | "Eraser"
  | "Type"
  | "Image"
  | "Minus"
  | "Rectangle";

interface CanvasProps {
  roomId: string;
  socket: WebSocket;
}

export default function Canvas({ roomId, socket }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedTool, setSelectedTool] = useState<Shape>("MousePointer2");

  useEffect(()=>{
    //@ts-ignore
    window.selectedTool= selectedTool
  },[selectedTool])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let cleanup: (() => void) | void;
    let mounted = true;

    (async () => {
      const result = await initDraw(canvas, roomId, socket);

      if (mounted) {
        cleanup = result;
      } else {
        result?.();
      }
    })();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      cleanup?.();
      window.removeEventListener("resize", handleResize);
    };
  }, [roomId, socket]);

  return (
    <div className="relative h-screen overflow-hidden">
      <canvas ref={canvasRef} className="block w-screen h-screen" />

      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

interface TopbarProps {
  selectedTool: Shape;
  setSelectedTool: React.Dispatch<React.SetStateAction<Shape>>;
}

function Topbar({ selectedTool, setSelectedTool }: TopbarProps) {
  return (
    <div className="fixed border p-2  border-neutral-500 bg-neutral-100 rounded-xl top-5 left-115">
      <div className="flex gap-2 text-black">
        <IconButton 
          
          activated={selectedTool === "MousePointer2"}
          icon={<MousePointer2 size={18} />}
          onClick={() => setSelectedTool("MousePointer2")}
        />

        <IconButton
          activated={selectedTool === "Hand"}
          icon={<Hand size={18} />}
          onClick={() => setSelectedTool("Hand")}
        />

        <IconButton
          activated={selectedTool === "Minus"}
          icon={<Minus size={18} />}
          onClick={() => setSelectedTool("Minus")}
        />

        <IconButton
          activated={selectedTool === "ArrowRight"}
          icon={<ArrowRight size={18} />}
          onClick={() => setSelectedTool("ArrowRight")}
        />

        <IconButton
          activated={selectedTool === "Rectangle"}
          icon={<Square size={18} />}
          onClick={() => setSelectedTool("Rectangle")}
        />

        <IconButton
          activated={selectedTool === "Diamond"}
          icon={<Diamond size={18} />}
          onClick={() => setSelectedTool("Diamond")}
        />

        <IconButton
          activated={selectedTool === "Circle"}
          icon={<Circle size={18} />}
          onClick={() => setSelectedTool("Circle")}
        />

        <IconButton
          activated={selectedTool === "Triangle"}
          icon={<Triangle size={18} />}
          onClick={() => setSelectedTool("Triangle")}
        />

        <IconButton
          activated={selectedTool === "Pencil"}
          icon={<Pencil size={18} />}
          onClick={() => setSelectedTool("Pencil")}
        />

        <IconButton
          activated={selectedTool === "Type"}
          icon={<Type size={18} />}
          onClick={() => setSelectedTool("Type")}
        />

        <IconButton
          activated={selectedTool === "Image"}
          icon={<Image size={18} />}
          onClick={() => setSelectedTool("Image")}
        />

        <IconButton
          activated={selectedTool === "Eraser"}
          icon={<Eraser size={18} />}
          onClick={() => setSelectedTool("Eraser")}
        />
      </div>
    </div>
  );
}
