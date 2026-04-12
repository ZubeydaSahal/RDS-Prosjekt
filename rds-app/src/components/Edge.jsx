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
  // HIERARCHY — fra bunn til topp med midtpunkt
  // ----------------------------
 if (type === "hierarchy") {
  const hy1 = from.y + 20;
  const hy2 = to.y - 20;
  const midY = (hy1 + hy2) / 2;

  return (
    <path
      d={`M ${from.x} ${hy1} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${hy2}`}
      fill="none"
      stroke="#999"
      strokeWidth={1.5}
    />
  );
}
  // ----------------------------
  // CROSS — fra høyre midten til venstre midten
  // ENDRING: separate koordinater for cross
  // ----------------------------
  if (type !== "hierarchy" && type !== "root") {

    const cx1 = from.x + NODE_WIDTH / 2;  // høyre side av from-node
    const cy1 = from.y;                    // midten av from-node
    const cx2 = to.x - NODE_WIDTH / 2;    // venstre side av to-node
    const cy2 = to.y;                      // midten av to-node

    return (
      <line
        x1={cx1}
        y1={cy1}
        x2={cx2}
        y2={cy2}
        stroke="orange"
        strokeWidth={1.5}
      />
    );
  }

  return null;
}