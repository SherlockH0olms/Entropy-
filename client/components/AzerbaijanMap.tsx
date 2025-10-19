import { useEffect, useRef, useState } from "react";

interface Tower {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  threatLevel: number;
}

interface AzerbaijanMapProps {
  towers: Tower[];
  attackedTowerId?: string;
}

// Baku coordinates as center
const BAKU_CENTER = { lat: 40.3856, lng: 49.892 };
const MAP_BOUNDS = {
  north: 41.5,
  south: 39.8,
  east: 50.8,
  west: 48.5,
};

interface MapState {
  offsetX: number;
  offsetY: number;
  scale: number;
}

const INITIAL_STATE: MapState = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
};

function getTowerColor(threatLevel: number): string {
  if (threatLevel < 30) return "#22c55e"; // Green
  if (threatLevel < 60) return "#eab308"; // Yellow
  if (threatLevel < 80) return "#f97316"; // Orange
  return "#ef4444"; // Red
}

function getTowerRadius(threatLevel: number, isAttacked: boolean): number {
  const baseRadius = 12;
  if (isAttacked) return baseRadius + 6;
  return baseRadius;
}

export function AzerbaijanMap({ towers, attackedTowerId }: AzerbaijanMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapState, setMapState] = useState<MapState>(INITIAL_STATE);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle mouse wheel zoom
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, mapState.scale * zoomFactor));

    setMapState((prev) => ({
      ...prev,
      scale: newScale,
    }));
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setMapState((prev) => ({
      ...prev,
      offsetX: prev.offsetX + deltaX,
      offsetY: prev.offsetY + deltaY,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle double click to reset
  const handleDoubleClick = () => {
    setMapState(INITIAL_STATE);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [mapState.scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Calculate pixel coordinates from lat/lng with transforms
    function latLngToPixel(lat: number, lng: number): { x: number; y: number } {
      const baseX =
        ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * width;
      const baseY =
        ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) *
        height;

      // Apply scale and offset
      const x = baseX * mapState.scale + mapState.offsetX;
      const y = baseY * mapState.scale + mapState.offsetY;
      return { x, y };
    }

    // Clear canvas
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Draw map background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#1e293b");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Baku city circle
    const bakuPixel = latLngToPixel(BAKU_CENTER.lat, BAKU_CENTER.lng);
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.arc(bakuPixel.x, bakuPixel.y, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw Baku label
    ctx.fillStyle = "#64748b";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Baku", bakuPixel.x, bakuPixel.y - 95);

    // Draw coastline hint (simplified)
    ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bakuPixel.x + 100, bakuPixel.y - 30, 120, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(59, 130, 246, 0.02)";
    ctx.fill();

    // Draw Caspian Sea label
    ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
    ctx.font = "11px italic Arial";
    ctx.textAlign = "center";
    ctx.fillText("Caspian", bakuPixel.x + 100, bakuPixel.y + 20);
    ctx.fillText("Sea", bakuPixel.x + 100, bakuPixel.y + 35);

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw attack propagation lines
    if (attackedTowerId) {
      const attackedTower = towers.find((t) => t.id === attackedTowerId);
      if (attackedTower) {
        const fromPixel = latLngToPixel(
          attackedTower.latitude,
          attackedTower.longitude,
        );

        // Draw animated lines to adjacent towers
        towers.forEach((tower) => {
          if (tower.id !== attackedTowerId) {
            const toPixel = latLngToPixel(tower.latitude, tower.longitude);

            // Gradient line
            const lineGradient = ctx.createLinearGradient(
              fromPixel.x,
              fromPixel.y,
              toPixel.x,
              toPixel.y,
            );
            lineGradient.addColorStop(0, "rgba(239, 68, 68, 0.6)");
            lineGradient.addColorStop(0.5, "rgba(239, 68, 68, 0.3)");
            lineGradient.addColorStop(1, "rgba(239, 68, 68, 0.1)");

            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fromPixel.x, fromPixel.y);
            ctx.lineTo(toPixel.x, toPixel.y);
            ctx.stroke();

            // Dashed effect for animation
            ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.moveTo(fromPixel.x, fromPixel.y);
            ctx.lineTo(toPixel.x, toPixel.y);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
          }
        });
      }
    }

    // Draw towers
    towers.forEach((tower) => {
      const pixel = latLngToPixel(tower.latitude, tower.longitude);
      const color = getTowerColor(tower.threatLevel);
      const radius = getTowerRadius(
        tower.threatLevel,
        tower.id === attackedTowerId,
      );
      const isAttacked = tower.id === attackedTowerId;

      // Outer glow for attacked tower
      if (isAttacked) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, radius + 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, radius + 12, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Tower circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Tower border
      ctx.strokeStyle = isAttacked ? "#fff" : "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = isAttacked ? 2 : 1;
      ctx.beginPath();
      ctx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Tower symbol (small + for communication)
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(pixel.x, pixel.y - 5);
      ctx.lineTo(pixel.x, pixel.y + 5);
      ctx.stroke();
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(pixel.x - 5, pixel.y);
      ctx.lineTo(pixel.x + 5, pixel.y);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Tower label
      ctx.fillStyle = isAttacked ? "#fff" : "#cbd5e1";
      ctx.font = isAttacked ? "bold 11px Arial" : "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(tower.name, pixel.x, pixel.y + radius + 18);
    });

    // Draw map title and legend
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Azerbaijan - Azercell 5G Network", 15, 25);

    // Draw legend
    const legendX = width - 180;
    const legendY = 20;
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(legendX - 5, legendY - 5, 170, 90);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 5, legendY - 5, 170, 90);

    ctx.font = "11px Arial";
    ctx.fillStyle = "#cbd5e1";

    const legendItems = [
      { color: "#22c55e", label: "Secure" },
      { color: "#eab308", label: "Alert" },
      { color: "#f97316", label: "Warning" },
      { color: "#ef4444", label: "Critical" },
    ];

    legendItems.forEach((item, idx) => {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(legendX + 5, legendY + 8 + idx * 20, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#cbd5e1";
      ctx.textAlign = "left";
      ctx.fillText(item.label, legendX + 18, legendY + 12 + idx * 20);
    });

    // Draw zoom and pan hints
    ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    ctx.fillText(
      "Scroll to zoom • Drag to pan • Double-click to reset",
      width - 15,
      height - 10,
    );
  }, [towers, attackedTowerId, mapState]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-slate-900/50 flex-shrink-0">
        <div className="w-4 h-4 rounded-full bg-cyan-400"></div>
        <h3 className="text-sm font-semibold text-slate-200">
          Azercell 5G Network - Baku Region
        </h3>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full flex-1 cursor-grab active:cursor-grabbing"
        style={{ minHeight: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
}
