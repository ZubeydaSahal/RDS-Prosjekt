export default function Edge({ from, to, type, allNodes }) {

  if (!from || !to) return null;

  const x1 = from.x;
  const y1 = from.y + 20;

  const x2 = to.x;
  const y2 = to.y - 20;

  // ----------------------------
  // ROOT → BUS SYSTEM
  // ----------------------------
  if (type === "root") {

    const root = from;

    const aspectNodes = allNodes?.filter(n => n.type === "aspect") || [];

    if (!aspectNodes.length) return null;

    const busY = root.y + 50;

    const xs = aspectNodes.map(n => n.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    return (
      <>
        {/* root → bus */}
        <line
          x1={root.x}
          y1={root.y + 30}
          x2={root.x}
          y2={busY}
          stroke="#999"
          strokeWidth={2}
        />

        {/* horisontal bus */}
        <line
          x1={minX}
          y1={busY}
          x2={maxX}
          y2={busY}
          stroke="#999"
          strokeWidth={2}
        />

        {/* ned til hvert aspekt */}
        {aspectNodes.map(node => (
          <line
            key={node.id}
            x1={node.x}
            y1={busY}
            x2={node.x}
            y2={node.y - 20}
            stroke="#999"
            strokeWidth={2}
          />
        ))}
      </>
    );
  }

  // ----------------------------
  // HIERARCHY (TREE)
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
  // CROSS RELATIONS (CURVE)
  // ----------------------------
  if (type === "cross") {

    const dx = Math.abs(x2 - x1);
    const curve = 0.6;

    return (
      <path
        d={`
          M ${x1} ${y1}
          C ${x1 + dx * curve} ${y1},
            ${x2 - dx * curve} ${y2},
            ${x2} ${y2}
        `}
        fill="none"
        stroke="#1e3a8a"
        strokeWidth={2}
      />
    );
  }

  return null;
}