export default function Edge({ from, to, type }) {

    // ----------------------------
    // SIKRER AT DATA FINNES
    // ----------------------------
    if (!from || !to) return null;
  
    // ----------------------------
    // START OG SLUTTPUNKT
    // ----------------------------
    const x1 = from.x;
    const y1 = from.y + 20; // bunn av parent
  
    const x2 = to.x;
    const y2 = to.y - 20;   // topp av child
  
  
    // ----------------------------
    // BEZIER CURVE (smooth)
    // ----------------------------
    const dx = Math.abs(x2 - x1);
    const curveStrength = 0.6;
  
    const path = `
      M ${x1} ${y1}
      C ${x1 + dx * curveStrength} ${y1},
        ${x2 - dx * curveStrength} ${y2},
        ${x2} ${y2}
    `;
  
  
    // ----------------------------
    // RETURNER SVG PATH
    // ----------------------------
    return (
      <path
        d={path}
        fill="none"
        stroke={type === "cross" ? "red" : "#999"}
        strokeWidth={1.5}
        strokeDasharray={type === "cross" ? "5,5" : "0"}
      />
    );
  }


// Gir rette streker mellom relasjoner
/* 
export default function Edge({ from, to, type }) {

  if (!from || !to) return null;

  // ----------------------------
  // START OG SLUTT
  // ----------------------------
  const x1 = from.x;
  const y1 = from.y + 20;

  const x2 = to.x;
  const y2 = to.y - 20;

  // Midtpunkt horisontalt
  const midX = (x1 + x2) / 2;

  // ----------------------------
  // L-SHAPE PATH
  // ----------------------------
  const path = `
    M ${x1} ${y1}
    L ${x1} ${y1 + 20}
    L ${midX} ${y1 + 20}
    L ${midX} ${y2 - 20}
    L ${x2} ${y2 - 20}
    L ${x2} ${y2}
  `;

  return (
    <path
      d={path}
      fill="none"
      stroke={type === "cross" ? "red" : "#999"}
      strokeWidth={1.5}
      strokeDasharray={type === "cross" ? "5,5" : "0"}
    />
  );
}
*/
  // Evt endre tilbake til denne, se an hva som fungerer best 
  /* 
  export default function Edge({ from, to, type }) {

    // Midtpunkt mellom noder (brukes for buet linje)
    const midY = (from.y + to.y) / 2;
  
    // Lager en path mellom nodene
    const path = `
  M ${from.x} ${from.y}
  L ${to.x} ${to.y}
`;
  
    // Farge basert på type relasjon
    const stroke =
      type === "cross" ? "#ff0000" : "#bbb";
  
    // Stiplet linje for cross-relasjoner
    const dash =
      type === "cross" ? "5,5" : "none";
  
    return (
      <path
        d={path}
        stroke={stroke}
        strokeDasharray={dash}
        strokeWidth={1.5}
        fill="none"
      />
    );
  }
   */