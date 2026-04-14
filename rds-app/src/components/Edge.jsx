const ASPECT_COLORS = {
  "=": "#f97316",
  "%": "#3b82f6",
  "-": "#22c55e",
  "%%": "#a855f7",
};

export default function Edge({ from, to, type, allNodes }) {

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
    const hy1 = from.y;
    const hy2 = to.y;

    return (
      <>
        <line x1={lineX} y1={hy1} x2={lineX} y2={hy2} stroke={color} strokeWidth={2} />
        <line x1={lineX} y1={hy2} x2={to.x - NODE_WIDTH / 2} y2={hy2} stroke={color} strokeWidth={2} />
      </>
    );
  }

  // ----------------------------
  // CROSS — S-kurve med relasjonsnavn midt på
  // ----------------------------
  if (type !== "hierarchy" && type !== "root") {
    const cx1 = from.x + NODE_WIDTH / 2;
    const cy1 = from.y;
    const cx2 = to.x - NODE_WIDTH / 2;
    const cy2 = to.y;

    const cpx1 = cx1 + (cx2 - cx1) * 0.5;
    const cpx2 = cx2 - (cx2 - cx1) * 0.5;

    // ENDRING: midtpunkt på kurven for label
    const midX = (cx1 + cx2) / 2;
    const midY = (cy1 + cy2) / 2;

    return (
      <>
        {/* S-kurve */}
        <path
          d={`M ${cx1} ${cy1} C ${cpx1} ${cy1} ${cpx2} ${cy2} ${cx2} ${cy2}`}
          fill="none"
          stroke="orange"
          strokeWidth={1.5}
        />

        {/* ENDRING: label boks midt på linjen */}
        <rect
          x={midX - 12}
          y={midY - 10}
          width={24}
          height={20}
          rx={3}
          fill="white"
          stroke="orange"
          strokeWidth={1}
        />
        <text
          x={midX}
          y={midY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fontWeight="bold"
          fill="orange"
        >
          {type}
        </text>
      </>
    );
  }

  return null;
}