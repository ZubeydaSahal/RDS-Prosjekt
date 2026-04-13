const ASPECT_COLORS = {
  "=": "#f97316",
  "%": "#3b82f6",
  "-": "#22c55e",
  "%%": "#a855f7",
};

export default function Edge({ from, to, type, allNodes, index = 0, total = 1 }) {

  if (!from || !to) return null;

  const NODE_HEIGHT = 40;
  const NODE_WIDTH = 160;
  const OFFSET = NODE_HEIGHT / 2;

  const aspectNodes =
    allNodes?.filter(n => n.type === "aspect") || [];

  if (!aspectNodes.length) return null;

  const topAspectY = Math.min(...aspectNodes.map(n => n.y));
  const busY = topAspectY - 30;

  const xs = aspectNodes.map(n => n.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

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

  if (type !== "hierarchy" && type !== "root") {

    const OFFSET_STEP = 6;
    const offset = (index - (total - 1) / 2) * OFFSET_STEP;

    const cx1 = from.x + NODE_WIDTH / 2;
    const cy1 = from.y + offset;

    const cx2 = to.x - NODE_WIDTH / 2;
    const cy2 = to.y + offset;

    const dx = cx2 - cx1;

    const cpx1 = cx1 + dx * 0.5;
    const cpx2 = cx2 - dx * 0.5;

    return (
      <path
        d={`M ${cx1} ${cy1} C ${cpx1} ${cy1} ${cpx2} ${cy2} ${cx2} ${cy2}`}
        fill="none"
        stroke="orange"
        strokeWidth={1.5}
      />
    );
  }

  return null;
}