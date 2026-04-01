export default function Edge({ from, to, type }) {

  if (!from || !to) return null;

  const x1 = from.x;
  const y1 = from.y + 20;

  const x2 = to.x;
  const y2 = to.y - 20;

  // ----------------------------
  // ROOT EDGES (rette, nesten flate)
  // ----------------------------
  if (type === "root") {

    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#999"
        strokeWidth={2}
      />
    );
  }

  // ----------------------------
  // HIERARCHY (L-shape / tree)
  // ----------------------------
  if (type === "hierarchy") {

    const midY = (y1 + y2) / 2;
  
    const path = `
      M ${x1} ${y1}
      L ${x1} ${midY}
      L ${x2} ${midY}
      L ${x2} ${y2}
    `;
  
    return (
      <path
        d={path}
        fill="none"
        stroke="#999"
        strokeWidth={1.5}
      />
    );
  }

  // ----------------------------
  // CROSS RELATIONS (curvy)
  // ----------------------------
  const dx = Math.abs(x2 - x1);
  const curve = 0.6;

  const path = `
    M ${x1} ${y1}
    C ${x1 + dx * curve} ${y1},
      ${x2 - dx * curve} ${y2},
      ${x2} ${y2}
  `;

  return (
    <path
      d={path}
      fill="none"
      stroke="#1e3a8a"  // mulig å endre fargen på kryssrelasjonen 
      strokeWidth={2}
    />
  );
}