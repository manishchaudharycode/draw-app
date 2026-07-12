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
      type: "square";
      x: number;
      y: number;
      size: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "diamond";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "triangle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "pencil";
      points: {
        x: number;
        y: number;
      }[];
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
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
  let pencilPoints: { x: number; y: number }[] = [];

  const handleMouseDown = (e: MouseEvent) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    //@ts-ignore
    if (window.selectedTool === "Pencil") {
      pencilPoints = [{ x: startX, y: startY }];
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    clearCanvas(existingShapes, canvas, ctx);

    // @ts-ignore
    const selectedTool = window.selectedTool;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    if (selectedTool === "Rectangle") {
      ctx.strokeRect(startX, startY, width, height);
    } else if (selectedTool === "Circle") {
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (selectedTool === "Diamond") {
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, startY);
      ctx.lineTo(startX + width, centerY);
      ctx.lineTo(centerX, startY + height);
      ctx.lineTo(startX, centerY);
      ctx.closePath();
      ctx.stroke();
    } else if (selectedTool === "Triangle") {
      const width = e.offsetX - startX;
      const height = e.offsetY - startY;
      const topX = startX + width / 2;
      const topY = startY;
      const bottomLeftX = startX;
      const bottomLeftY = startY + height;
      const bottomRightX = startX + width;
      const bottomRightY = startY + height;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(bottomRightX, bottomRightY);
      ctx.lineTo(bottomLeftX, bottomLeftY);
      ctx.closePath();
      ctx.stroke();
    } else if (selectedTool === "Pencil") {
      pencilPoints.push({
        x: e.offsetX,
        y: e.offsetY,
      });
      ctx.beginPath();
      ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
      for (let i = 1; i < pencilPoints.length; i++) {
        ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
      }
      ctx.stroke();
    } else if (selectedTool === "Square") {
      const size = Math.max(Math.abs(width), Math.abs(height));
      ctx.strokeRect(
        startX,
        startY,
        width < 0 ? -size : size,
        height < 0 ? -size : size,
      );
    } else if (selectedTool === "Minus") {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    } else if (selectedTool === "Type") {
      ctx.beginPath();
      ctx.stroke();
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;

    isDrawing = false;

    //@ts-ignore
    const selectedTool = window.selectedTool;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    let newShape: Shape | null = null;

    switch (selectedTool) {
      case "Rectangle":
        newShape = {
          type: "rect",
          x: startX,
          y: startY,
          width,
          height,
        };
        break;

      case "Square": {
        const size = Math.max(Math.abs(width), Math.abs(height));

        newShape = {
          type: "square",
          x: startX,
          y: startY,
          size,
        };
        break;
      }

      case "Circle":
        newShape = {
          type: "circle",
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          radius: Math.max(Math.abs(width), Math.abs(height)) / 2,
        };
        break;

      case "Diamond":
        newShape = {
          type: "diamond",
          x: startX,
          y: startY,
          width,
          height,
        };
        break;

      case "Triangle":
        newShape = {
          type: "triangle",
          x: startX,
          y: startY,
          width,
          height,
        };
        break;

      case "Minus":
        newShape = {
          type: "line",
          startX,
          startY,
          endX: e.offsetX,
          endY: e.offsetY,
        };
        break;

      case "Pencil":
        newShape = {
          type: "pencil",
          points: [...pencilPoints], // Copy the array
        };
        pencilPoints = [];
        break;

      case "Type": {
        const text = prompt("Enter text");
        if (!text) return;

        newShape = {
          type: "text",
          x: startX,
          y: startY,
          text,
        };
        break;
      }

      case "Hand":
        return;

      case "Eraser":
        return;

      default:
        return;
    }

    if (!newShape) return;

    existingShapes.push(newShape);

    clearCanvas(existingShapes, canvas, ctx);

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify({
          newShape,
        }),
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
    } else if (shape.type === "square") {
      ctx.strokeRect(shape.x, shape.y, shape.size, shape.size);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "diamond") {
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, shape.y);
      ctx.lineTo(shape.x + shape.width, centerY);
      ctx.lineTo(centerX, shape.y + shape.height);
      ctx.lineTo(shape.x, centerY);
      ctx.closePath();
      ctx.stroke();
    } else if (shape.type === "triangle") {
      const topX = shape.x + shape.width / 2;
      const topY = shape.y;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
      ctx.lineTo(shape.x, shape.y + shape.height);
      ctx.closePath();
      ctx.stroke();
    } else if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    } else if (shape.type === "pencil") {
      if (shape.points.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      ctx.stroke();
    } else if (shape.type === "text") {
      ctx.fillStyle = "red";
      ctx.font = "40px Arial";
      ctx.fillText(shape.text, shape.x, shape.y);
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
