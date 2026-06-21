import { WebSocketServer, WebSocket } from "ws";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

const PORT = 8080;

const wss = new WebSocketServer({
  port: PORT,
});

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded?.id) {
      return null;
    }

    return decoded.id;
  } catch {
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;

  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) {
    ws.close();
    return;
  }

  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data.toString());

      if (parsedData.type === "join-room") {
        const user = users.find((u) => u.ws === ws);

        if (user && !user.rooms.includes(parsedData.roomId)) {
          user.rooms.push(parsedData.roomId);
        }
      }

      if (parsedData.type === "leave-room") {
        const user = users.find((u) => u.ws === ws);

        if (!user) {
          return;
        }

        user.rooms = user.rooms.filter((room) => room !== parsedData.roomId);
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await prisma.chat.create({
          data: {
            roomId,
            message,
            userId,
          },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                roomId,
                message,
                userId,
              }),
            );
          }
        });
      }
    } catch (err) {
      console.error("Message processing error:", err);
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);

    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});

console.log(`WS Server running on port ${PORT}`);
