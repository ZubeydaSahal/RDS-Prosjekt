export default function Edge({ from, to, type, busY, index = 0 }) {

  if (!from || !to) return null;

  const NODE_OFFSET = 20;

  const x1 = from.x;
  const y1 = from.y + NODE_OFFSET;

  const x2 = to.x;
  const y2 = to.y - NODE_OFFSET;

  // ----------------------------
  // HIERARCHY
  // ----------------------------
  if (type === "hierarchy") {

    const midY = (y1 + y2) / 2;

    return (
      <path
        d={`
          M ${x1} ${y1}
          L ${x1} ${midY}
          L ${x2} ${midY}
          L ${x2} ${y2}
        `}
        fill="none"
        stroke="#999"
        strokeWidth={1.5}
      />
    );
  }

  // ----------------------------
  // 🔥 SMART CROSS AUTO-ROUTING
  // ----------------------------
  if (type === "cross") {

    if (!busY) return null;

    // retning (kan brukes senere hvis du vil utvide)
    const direction = x2 > x1 ? 1 : -1;

    const distance = Math.abs(x2 - x1);

    // 🔥 dynamisk offset (nære linjer får mer plass)
    const baseOffset = Math.max(10, 60 - distance * 0.1);

    const laneSpacing = 10;

    // maks 6 lanes før reset
    const lane = index % 6;

    const yLane = busY - baseOffset - lane * laneSpacing;

    return (
      <>
        {/* opp */}
        <line
          x1={x1}
          y1={y1}
          x2={x1}
          y2={yLane}
          stroke="#1e3a8a"
          strokeWidth={2}
        />

        {/* bort */}
        <line
          x1={x1}
          y1={yLane}
          x2={x2}
          y2={yLane}
          stroke="#1e3a8a"
          strokeWidth={2}
        />

        {/* ned */}
        <line
          x1={x2}
          y1={yLane}
          x2={x2}
          y2={y2}
          stroke="#1e3a8a"
          strokeWidth={2}
        />
      </>
    );
  }

  return null;
}