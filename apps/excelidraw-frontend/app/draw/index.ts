import axios from "axios";
import { HTTP_BACKEND } from "@/config";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

interface MessageItem {
  messages: Shape;
}

interface ChatResponse {
  messages: MessageItem[];
}

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
): Promise<(() => void) | void> {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const parsedshape = JSON.parse(message.message);
      existingShapes.push(parsedshape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  let existingShapes: Shape[] = [];

  try {
    existingShapes = await getExistingShapes(roomId);
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
  }
  clearCanvas(existingShapes, canvas, ctx);

  let isDrawing = false;
  let startX = 0;
  let startY = 0;

  const handleMouseDown = (e: MouseEvent) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    clearCanvas(existingShapes, canvas, ctx);

    ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;

    isDrawing = false;

    const newShape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width: e.offsetX - startX,
      height: e.offsetY - startY,
    };

    existingShapes.push(newShape);

    clearCanvas(existingShapes, canvas, ctx);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          newShape,
        }),
        roomId,
      }),
    );
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
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get<ChatResponse>(
      `${HTTP_BACKEND}/chats/${roomId}`,
    );

    console.log("Response:", res.data);

    return res.data.messages.map((item) => item.messages);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
      console.log("URL:", `${HTTP_BACKEND}/chats/${roomId}`);
    } else {
      console.log(err);
    }

    return [];
  }
}
