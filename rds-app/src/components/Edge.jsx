export default function Edge({ from, to }) {

    const midY = (from.y + to.y) / 2;
  
    const path = `
      M ${from.x} ${from.y}
      C ${from.x} ${midY},
        ${to.x} ${midY},
        ${to.x} ${to.y}
    `;
  
    return (
      <path
        d={path}
        stroke="#bbb"
        strokeWidth={1.5}
        fill="none"
      />
    );
  }