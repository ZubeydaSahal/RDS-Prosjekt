import { useState } from "react";

const ASPECT_COLORS = {
  "=": "#f97316",
  "%": "#3b82f6",
  "-": "#22c55e",
  "%%": "#a855f7",
};

// Genererer en unik farge per relasjonstype.
// Bruker gullforholdet (137.508°) for å spre fargetoner jevnt,
// slik at selv veldig like typenavn får svært ulike farger.
function getRelationColor(type) {
  if (!type) return "#94a3b8";
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = (hash << 5) - hash + type.charCodeAt(i);
    hash |= 0;
  }
  const hue = (Math.abs(hash) * 137.508) % 360;
  return `hsl(${hue}, 65%, 48%)`;
}

// ENDRING: viser "——" for relasjoner uten type
function getRelationLabel(type) {
  if (!type) return "——";
  return `|${type}|`;
}

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

  const NODE_WIDTH = 160;

  const aspectNodes = allNodes?.filter(n => n.type === "aspect") || [];
  if (!aspectNodes.length) return null;

  if (type === "root") return null;

  // --------------------------------------------------
  // HIERARCHY 
  // --------------------------------------------------
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

  // --------------------------------------------------
  // INTRA-ASPECT RELASJONER
  // --------------------------------------------------
  const sameAspect = from.aspect && to.aspect && from.aspect === to.aspect;

  if (sameAspect) {
    const startX = from.x + NODE_WIDTH / 2;
    const startY = from.y;
    const endX = to.x + NODE_WIDTH / 2;
    const endY = to.y;
    const OUT_OFFSET = 80;
    const spread = (index % 5) * 20;
    const sideX = startX + OUT_OFFSET + spread;

    const strokeColor = getRelationColor(type);
    const label = getRelationLabel(type);
    const midY = (startY + endY) / 2;

    return (
      <>
        <path
          d={`M ${startX} ${startY} L ${sideX} ${startY} L ${sideX} ${endY} L ${endX} ${endY}`}
          fill="none" stroke="transparent" strokeWidth={14}
          onMouseEnter={() => setHoveredEdge(edgeId)}
          onMouseLeave={() => setHoveredEdge(null)}
        />
        <path
          d={`M ${startX} ${startY} L ${sideX} ${startY} L ${sideX} ${endY} L ${endX} ${endY}`}
          fill="none" stroke={strokeColor}
          strokeWidth={isHovered ? 6 : 3}
          opacity={isHovered ? 1 : 0.35}
          style={{ pointerEvents: "none" }}
        />
        <rect x={sideX - 16} y={midY - 12} width={32} height={24} rx={4} fill="white" stroke={strokeColor} strokeWidth={1.5} />
        <text x={sideX} y={midY} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold" fill={strokeColor}>
          {label}
        </text>
      </>
    );
  }

  // --------------------------------------------------
  // CROSS RELASJONER
  // --------------------------------------------------
  const cx1 = from.x + NODE_WIDTH / 2;
  const cy1 = from.y;
  const cx2 = to.x - NODE_WIDTH / 2;
  const cy2 = to.y;

  const SPACING = 15;
  const offsetIndex = (index % 7) - 3;
  const offsetY = offsetIndex * SPACING;
  const offsetX = offsetIndex * 10;
  const bend = 60;
  const cpx1 = cx1 + bend + offsetX;
  const cpx2 = cx2 - bend + offsetX;
  const cpy1 = cy1 + offsetY;
  const cpy2 = cy2 + offsetY;

  const t = 0.5;
  const midX =
    Math.pow(1-t,3)*cx1 + 3*Math.pow(1-t,2)*t*cpx1 +
    3*(1-t)*Math.pow(t,2)*cpx2 + Math.pow(t,3)*cx2;
  const midY =
    Math.pow(1-t,3)*cy1 + 3*Math.pow(1-t,2)*t*cpy1 +
    3*(1-t)*Math.pow(t,2)*cpy2 + Math.pow(t,3)*cy2;

  const strokeColor = getRelationColor(type);
  const label = getRelationLabel(type);

  return (
    <>
      <path
        d={`M ${cx1} ${cy1} C ${cpx1} ${cpy1} ${cpx2} ${cpy2} ${cx2} ${cy2}`}
        fill="none" stroke="transparent" strokeWidth={14}
        onMouseEnter={() => setHoveredEdge(edgeId)}
        onMouseLeave={() => setHoveredEdge(null)}
      />
      <path
        d={`M ${cx1} ${cy1} C ${cpx1} ${cpy1} ${cpx2} ${cpy2} ${cx2} ${cy2}`}
        fill="none" stroke={strokeColor}
        strokeWidth={isHovered ? 6 : 3}
        opacity={isHovered ? 1 : 0.25}
        style={{ pointerEvents: "none" }}
      />
      <rect x={midX-16} y={midY-12} width={32} height={24} rx={4} fill="white" stroke={strokeColor} strokeWidth={1.5} opacity={isHovered ? 1 : 0.8} style={{ pointerEvents: "none" }} />
      <text x={midX} y={midY} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold" fill={strokeColor} style={{ pointerEvents: "none" }}>
        {label}
      </text>
    </>
  );
}