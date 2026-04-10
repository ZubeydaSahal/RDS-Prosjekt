export default function Edge({ from, to, type, allNodes }) {

  if (!from || !to) return null;

  const NODE_HEIGHT = 40;
  const OFFSET = NODE_HEIGHT / 2;

  const x1 = from.x;
  const y1 = from.y + OFFSET;

  const x2 = to.x;
  const y2 = to.y - OFFSET;

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
        {/* root → bus */}
        <line
          x1={root.x}
          y1={root.y + OFFSET}
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

        {/* bus → aspekter */}
        {aspectNodes.map(node => (
          <line
            key={node.id}
            x1={node.x}
            y1={busY}
            x2={node.x}
            y2={node.y - OFFSET}
            stroke="#999"
            strokeWidth={2}
          />
        ))}
      </>
    );
  }

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
  // CROSS (GRÅ + VIA BUS)
  // ----------------------------
  if (type === "cross") {

    return (
      <>
        {/* opp */}
        <line
          x1={x1}
          y1={y1}
          x2={x1}
          y2={busY}
          stroke="#999"
          strokeWidth={2}
        />

        {/* bort (samme bus) */}
        <line
          x1={x1}
          y1={busY}
          x2={x2}
          y2={busY}
          stroke="#999"
          strokeWidth={2}
        />

        {/* ned */}
        <line
          x1={x2}
          y1={busY}
          x2={x2}
          y2={y2}
          stroke="#999"
          strokeWidth={2}
        />
      </>
    );
  }

  return null;
}