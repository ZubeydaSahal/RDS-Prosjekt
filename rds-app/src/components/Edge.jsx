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

  // Hvis noder mangler, rendrer vi ingenting
  if (!from || !to) return null;

  const NODE_WIDTH = 160;

  // Henter alle aspekter (brukes som sikkerhetssjekk)
  const aspectNodes =
    allNodes?.filter(n => n.type === "aspect") || [];

  if (!aspectNodes.length) return null;

  // --------------------------------------------------
  // ROOT 
  // --------------------------------------------------
  if (type === "root") {
    return null;
  }

  // --------------------------------------------------
  // HIERARCHY 
  // --------------------------------------------------
  if (type === "hierarchy") {
    const aspect = from.aspect;
    const color = ASPECT_COLORS[aspect] || "#999";

    // Linjen tegnes til venstre for nodene
    const lineX = from.x - NODE_WIDTH / 2 - 10;

    return (
      <>
        <line
          x1={lineX}
          y1={from.y}
          x2={lineX}
          y2={to.y}
          stroke={color}
          strokeWidth={3}
        />
        <line
          x1={lineX}
          y1={to.y}
          x2={to.x - NODE_WIDTH / 2}
          y2={to.y}
          stroke={color}
          strokeWidth={3}
        />
      </>
    );
  }

  // --------------------------------------------------
  // INTRA-ASPECT RELASJONER
  // Hvis to noder tilhører samme aspekt (samme kolonne),
  // rutes relasjonen utenfor kolonnen for å unngå overlap.
  // --------------------------------------------------
  const sameAspect =
    from.aspect && to.aspect && from.aspect === to.aspect;

  if (sameAspect) {

    const startX = from.x + NODE_WIDTH / 2;
    const startY = from.y;

    const endX = to.x + NODE_WIDTH / 2;
    const endY = to.y;

    // Hvor langt ut til høyre vi går før vi går ned/opp
    const OUT_OFFSET = 80;

    // Sprer flere parallelle relasjoner
    const spread = (index % 5) * 20;
    const sideX = startX + OUT_OFFSET + spread;

    // Farge basert på type
    let strokeColor = "#94a3b8";
    if (type === "A") strokeColor = "#f97316";
    else if (type === "B") strokeColor = "#3b82f6";

    // Midtpunkt for label
    const midY = (startY + endY) / 2;

    return (
      <>
        {/* Hitbox gjør det enklere å treffe linjen med mus */}
        <path
          d={`M ${startX} ${startY}
              L ${sideX} ${startY}
              L ${sideX} ${endY}
              L ${endX} ${endY}`}
          fill="none"
          stroke="transparent"
          strokeWidth={14}
          onMouseEnter={() => setHoveredEdge(edgeId)}
          onMouseLeave={() => setHoveredEdge(null)}
        />

        {/* Synlig linje */}
        <path
          d={`M ${startX} ${startY}
              L ${sideX} ${startY}
              L ${sideX} ${endY}
              L ${endX} ${endY}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isHovered ? 6 : 3}
          opacity={isHovered ? 1 : 0.35}
          style={{ pointerEvents: "none" }}
        />

        {/* Label */}
        <rect
          x={sideX - 16}
          y={midY - 12}
          width={32}
          height={24}
          rx={4}
          fill="white"
          stroke={strokeColor}
          strokeWidth={1.5}
        />

        <text
          x={sideX}
          y={midY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="bold"
          fill={strokeColor}
        >
          |{type}|
        </text>
      </>
    );
  }

  // --------------------------------------------------
  // CROSS RELASJONER (mellom aspekter)
  // Her brukes Bézier-kurver med offset for å separere linjer
  // --------------------------------------------------

  const cx1 = from.x + NODE_WIDTH / 2;
  const cy1 = from.y;

  const cx2 = to.x - NODE_WIDTH / 2;
  const cy2 = to.y;

  // Gir stabil separasjon mellom parallelle relasjoner
  const SPACING = 15;
  const offsetIndex = (index % 7) - 3;

  const offsetY = offsetIndex * SPACING;
  const offsetX = offsetIndex * 10;

  // Hvor kraftig kurven bøyer seg
  const bend = 60;

  const cpx1 = cx1 + bend + offsetX;
  const cpx2 = cx2 - bend + offsetX;

  const cpy1 = cy1 + offsetY;
  const cpy2 = cy2 + offsetY;

  // Beregner midtpunkt langs kurven (for label)
  const t = 0.5;

  const midX =
    Math.pow(1 - t, 3) * cx1 +
    3 * Math.pow(1 - t, 2) * t * cpx1 +
    3 * (1 - t) * Math.pow(t, 2) * cpx2 +
    Math.pow(t, 3) * cx2;

  const midY =
    Math.pow(1 - t, 3) * cy1 +
    3 * Math.pow(1 - t, 2) * t * cpy1 +
    3 * (1 - t) * Math.pow(t, 2) * cpy2 +
    Math.pow(t, 3) * cy2;

  // Fargevalg
  let strokeColor = "#94a3b8";
  if (type === "A") strokeColor = "#f97316";
  else if (type === "B") strokeColor = "#3b82f6";

  return (
    <>
      {/* Hitbox */}
      <path
        d={`M ${cx1} ${cy1}
            C ${cpx1} ${cpy1}
              ${cpx2} ${cpy2}
              ${cx2} ${cy2}`}
        fill="none"
        stroke="transparent"
        strokeWidth={14}
        onMouseEnter={() => setHoveredEdge(edgeId)}
        onMouseLeave={() => setHoveredEdge(null)}
      />

      {/* Synlig linje */}
      <path
        d={`M ${cx1} ${cy1}
            C ${cpx1} ${cpy1}
              ${cpx2} ${cpy2}
              ${cx2} ${cy2}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isHovered ? 6 : 3}
        opacity={isHovered ? 1 : 0.25}
        style={{ pointerEvents: "none" }}
      />

      {/* Label */}
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