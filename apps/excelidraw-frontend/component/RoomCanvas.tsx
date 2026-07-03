"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import Canvas from "./Canvas";

interface RoomCanvasProps {
  roomId: string;
}

export default function RoomCanvas({ roomId }: RoomCanvasProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyZDg5NzNlLTIxMzctNDEyZS05NzI2LTI4MzU3NmRlYjlmMyIsImVtYWlsIjoibWFuaUBnbWFpbC5jb20iLCJuYW1lIjoic3V1ZCIsImlhdCI6MTc4MjkxNzk1OX0.P_a_cLmnyU2HHXWoXqnXgECwnbSYwk9T6RAzSTL66ms`,
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!socket) {
    return (
      <div className="flex h-screen items-center justify-center">
        Connecting to server...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
