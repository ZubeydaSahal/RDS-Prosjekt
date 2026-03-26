export default function Edge({ from, to, type }) {

    // Midtpunkt mellom noder (brukes for buet linje)
    const midY = (from.y + to.y) / 2;
  
    // Lager en kurvet path mellom nodene
    const path = `
      M ${from.x} ${from.y}
      C ${from.x} ${midY},
        ${to.x} ${midY},
        ${to.x} ${to.y}
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