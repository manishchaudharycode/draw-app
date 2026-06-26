"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import { WS_URL } from "../app/config";

export function ChatRoomClient({
  id,
  messages,
}: {
  id: string;
  messages: { message: string }[];
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyZDg5NzNlLTIxMzctNDEyZS05NzI2LTI4MzU3NmRlYjlmMyIsImVtYWlsIjoibWFuaUBnbWFpbC5jb20iLCJuYW1lIjoic3V1ZCIsImlhdCI6MTc4MjMxNjE4M30.gj5QlIpLizjhSAHJ1nOORa-DWwtYQXcxFS47pmcTrV0`
    );

    ws.onopen = () => {
      console.log("Connected");

      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );
    };

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      if (parsedData.type === "chat") {
        setChats((prev) => [
          ...prev,
          { message: parsedData.message },
        ]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [id]);

  return (
    <div>
      {chats.map((chat, index) => (
        <div key={index}>{chat.message}</div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />

      <Button
        onClick={() => {
          if (!socket) return;

          socket.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );

          setCurrentMessage("");
        }}
      >
        Send Message
      </Button>
    </div>
  );
}