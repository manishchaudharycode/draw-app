export function initDraw(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

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

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(startX, startY, width, height);
  };

  const handleMouseUp = () => {
    isDrawing = false;
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseleave", handleMouseUp);

  // Cleanup
  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mouseleave", handleMouseUp);
  };
}
