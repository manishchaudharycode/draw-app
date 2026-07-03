import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";

interface CanvasProps {
  roomId: string;
  socket: WebSocket;
}

export default function Canvas({ roomId, socket }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [roomId, socket]);

  return (
    <div>
      <canvas ref={canvasRef} className="h-full w-full bg-black" />
    </div>
  );
}
