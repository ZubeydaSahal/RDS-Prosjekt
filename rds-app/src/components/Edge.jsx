import { useState } from "react";

const ASPECT_COLORS = {
  "=": "#f97316",
  "%": "#3b82f6",
  "-": "#22c55e",
  "%%": "#a855f7",
};

export default function Edge({ 
  from, 
  to, 
  type, 
  allNodes,
  edgeId,
  index = 0,
  isHovered,
  setHoveredEdge
}) {

  if (!from || !to) return null;

  const NODE_HEIGHT = 40;
  const NODE_WIDTH = 160;
  const OFFSET = NODE_HEIGHT / 2;

  // ----------------------------
  // FINN ASPEKTER + BUS
  // ----------------------------
  const aspectNodes =
    allNodes?.filter(n => n.type === "aspect") || [];

  if (!aspectNodes.length) return null;

  const topAspectY = Math.min(...aspectNodes.map(n => n.y));
  const busY = topAspectY - 30;

  const xs = aspectNodes.map(n => n.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  // ----------------------------
  // ROOT → BUS SYSTEM 
  // ----------------------------
  if (type === "root") {
    const root = from;
    return (
      <>
        <line x1={root.x} y1={root.y + OFFSET} x2={root.x} y2={busY} stroke="#999" strokeWidth={2} />
        <line x1={minX} y1={busY} x2={maxX} y2={busY} stroke="#999" strokeWidth={2} />
        {aspectNodes.map(node => (
          <line key={node.id} x1={node.x} y1={busY} x2={node.x} y2={node.y - OFFSET} stroke="#999" strokeWidth={2} />
        ))}
      </>
    );
  }

  // ----------------------------
  // HIERARCHY 
  // ----------------------------
  if (type === "hierarchy") {
    const aspect = from.aspect;
    const color = ASPECT_COLORS[aspect] || "#999";
    const lineX = from.x - NODE_WIDTH / 2 - 10;

    return (
      <>
        <line x1={lineX} y1={from.y} x2={lineX} y2={to.y} stroke={color} strokeWidth={3} />
        <line x1={lineX} y1={to.y} x2={to.x - NODE_WIDTH / 2} y2={to.y} stroke={color} strokeWidth={3} />
      </>
    );
  }

  // ----------------------------
  // CROSS — ROUTING + PARALLELL FIX
  // ----------------------------
  if (type !== "hierarchy" && type !== "root") {

    const cx1 = from.x + NODE_WIDTH / 2;
    const cy1 = from.y;

    const cx2 = to.x - NODE_WIDTH / 2;
    const cy2 = to.y;

    // ----------------------------
    // PARALLELL SEPARASJON (X + Y)
    // ----------------------------
    const SPACING = 15;
    const offsetIndex = (index % 7) - 3;

    const offsetY = offsetIndex * SPACING;
    const offsetX = offsetIndex * 10;

    // ----------------------------
    // EDGE ROUTING
    // ----------------------------
    const bend = 60;

    const startX = cx1;
    const startY = cy1;

    const endX = cx2;
    const endY = cy2;

    const cpx1 = startX + bend + offsetX;
    const cpx2 = endX - bend + offsetX;

    const cpy1 = startY + offsetY;
    const cpy2 = endY + offsetY;

    // ----------------------------
    // LABEL PÅ KURVEN
    // ----------------------------
    const t = 0.5;

    const midX =
      Math.pow(1 - t, 3) * startX +
      3 * Math.pow(1 - t, 2) * t * cpx1 +
      3 * (1 - t) * Math.pow(t, 2) * cpx2 +
      Math.pow(t, 3) * endX;

    const midY =
      Math.pow(1 - t, 3) * startY +
      3 * Math.pow(1 - t, 2) * t * cpy1 +
      3 * (1 - t) * Math.pow(t, 2) * cpy2 +
      Math.pow(t, 3) * endY;

    // ----------------------------
    // FARGE
    // ----------------------------
    let strokeColor = "orange";
    if (type === "A") strokeColor = "#ffa040";
    else if (type === "B") strokeColor = "#6187a5";

    return (
      <>
        {/* HITBOX */}
        <path
          d={`M ${startX} ${startY}
              C ${cpx1} ${cpy1}
                ${cpx2} ${cpy2}
                ${endX} ${endY}`}
          fill="none"
          stroke="transparent"
          strokeWidth={14}
          onMouseEnter={() => setHoveredEdge(edgeId)}
          onMouseLeave={() => setHoveredEdge(null)}
        />

        {/* SYNLIG LINJE */}
        <path
          d={`M ${startX} ${startY}
              C ${cpx1} ${cpy1}
                ${cpx2} ${cpy2}
                ${endX} ${endY}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isHovered ? 6 : 3}
          opacity={isHovered ? 1 : 0.25}
          style={{ pointerEvents: "none" }}
        />

        {/* LABEL */}
        <rect
          x={midX - 16}
          y={midY - 12}
          width={32}
          height={24}
          rx={4}
          fill="white"
          stroke={strokeColor}
          strokeWidth={1.5}
          opacity={isHovered ? 1 : 0.8}
          style={{ pointerEvents: "none" }}
        />

        <text
          x={midX}
          y={midY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="bold"
          fill={strokeColor}
          style={{ pointerEvents: "none" }}
        >
          |{type}|
        </text>
      </>
    );
  }

  return null;
}