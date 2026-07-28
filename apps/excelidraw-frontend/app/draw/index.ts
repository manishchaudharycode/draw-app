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
      startX: number;
      startY: number;
      endX: number;
      endY: number;
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
    }
  | {
      type: "ArrowRight";
      x: number;
      y: number;
      endX: number;
      endY: number;
      startX: number;
      startY: number;
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
  // // Draw a rectangle
  // ctx.fillStyle = "blue";
  // ctx.fillRect(100, 100, 200, 150);

  // // Draw some text far away
  // ctx.font = "30px Arial";
  // ctx.fillText("Scroll to see me!", 700, 700);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  let existingShapes: Shape[] = [];

  try {
    existingShapes = await getExistingShapes(roomId);
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
  }
  clearCanvas(existingShapes, canvas, ctx);

  const camera = {
    x: 0,
    y: 0,
  };
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let pencilPoints: { x: number; y: number }[] = [];

  const handleMouseDown = (e: MouseEvent) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    lastX = e.clientX;
    lastY = e.clientY;
    //@ts-ignore
    if (window.selectedTool === "Pencil") {
      pencilPoints = [{ x: startX, y: startY }];
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    camera.x -= e.clientX - lastX;
    camera.y -= e.clientY - lastY;

    lastX = e.clientX;
    lastY = e.clientY;
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
      ctx.beginPath();
      if (Math.abs(width) > Math.abs(height)) {
        if (width > 0) {
          // Right pointing ▶
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX, startY + height);
          ctx.lineTo(e.offsetX, startY + height / 2);
        } else {
          // Left pointing ◀
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX, startY + height);
          ctx.lineTo(e.offsetX, startY + height / 2);
        }
      } else {
        // Vertical drag
        if (height > 0) {
          // Down pointing ▼
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + width, startY);
          ctx.lineTo(startX + width / 2, e.offsetY);
        } else {
          // Up pointing ▲
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + width, startY);
          ctx.lineTo(startX + width / 2, e.offsetY);
        }
      }
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
      ctx.font = "20px Georgia";
      ctx.fillText("Hello World!", 10, 50);
    } else if (selectedTool === "ArrowRight") {
      const headLength = 10;
      const angle = Math.atan2(y - startY, x - startX);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.lineTo(
        x - headLength * Math.cos(angle - Math.PI / 6),
        y - headLength * Math.sin(angle - Math.PI / 6),
      );
      ctx.moveTo(x, y);
      ctx.lineTo(
        x - headLength * Math.cos(angle + Math.PI / 6),
        y - headLength * Math.sin(angle + Math.PI / 6),
      );
      ctx.stroke();
    } else if (selectedTool === "") {
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
          startX,
          startY,
          endX: e.offsetX,
          endY: e.offsetY,
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
      case "ArrowRight": {
        newShape = {
          type: "ArrowRight",
          x: e.offsetX,
          y: e.offsetY,
          startX,
          startY,
          endX: e.offsetX,
          endY: e.offsetY,
        };
        break;
      }

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
      const dx = shape.endX - shape.startX;
      const dy = shape.endY - shape.startY;

      ctx.beginPath();

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal triangle

        if (dx > 0) {
          // ▶ Right
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.startX, shape.endY);
          ctx.lineTo(shape.endX, (shape.startY + shape.endY) / 2);
        } else {
          // ◀ Left
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.startX, shape.endY);
          ctx.lineTo(shape.endX, (shape.startY + shape.endY) / 2);
        }
      } else {
        // Vertical triangle

        if (dy > 0) {
          // ▼ Down
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.startY);
          ctx.lineTo((shape.startX + shape.endX) / 2, shape.endY);
        } else {
          // ▲ Up
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.startY);
          ctx.lineTo((shape.startX + shape.endX) / 2, shape.endY);
        }
      }

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
      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.fillText(shape.text, shape.x, shape.y);
    } else if (shape.type === "ArrowRight") {
      const headLength = 10;
      const angle = Math.atan2(
        shape.endY - shape.startY,
        shape.endX - shape.startX,
      );
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.lineTo(
        shape.endX - headLength * Math.cos(angle - Math.PI / 6),
        shape.endY - headLength * Math.sin(angle - Math.PI / 6),
      );
      ctx.moveTo(shape.endX, shape.endY);
      ctx.lineTo(
        shape.endX - headLength * Math.cos(angle + Math.PI / 6),
        shape.endY - headLength * Math.sin(angle + Math.PI / 6),
      );
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
