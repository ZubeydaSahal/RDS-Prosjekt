export default function Node({ node }) {

  // Finn aspekt riktig (støtter %%)
  const getAspect = (id) => {
    if (!id) return null;

    if (id.startsWith("%%")) return "%%";
    if (id.startsWith("%")) return "%";
    if (id.startsWith("=")) return "=";
    if (id.startsWith("-")) return "-";

    return null;
  };

  const aspect = getAspect(node.id);

  // Farger for vanlige noder (border)
  const aspectColors = {
    "%": "#4da3ff",   // blå
    "=": "#ff9f6e",   // oransje
    "-": "#7ed957",   // grønn
    "%%": "#a78bfa"   // lilla
  };

  // Farger for aspect headers (bakgrunn)
  const aspectHeaderColors = {
    "%": "#cfe8ff",
    "=": "#ffd6bf",
    "-": "#d4f5d0",
    "%%": "#e4d7ff"
  };

  const strokeColor = aspectColors[aspect] || "#888";

  // Type nodes
  const isAspect = node.id?.startsWith("aspect_");
    const isRoot = node.id === node.label;

  // Finn aspect key for header
  const aspectKey = isAspect ? node.id.replace("aspect_", "") : null;

  return (
    <g>

      <rect
        x={node.x - 70}
        y={node.y - 20}
        width={140}
        height={40}
        rx={8}

        fill={
          isRoot
            ? "#1e3a8a"                              // root
            : isAspect
            ? aspectHeaderColors[aspectKey] || "#eee" // header
            : "#ffffff"                               // vanlig node
        }

        stroke={
          isRoot
            ? "#1e3a8a"
            : isAspect
            ? "#999"
            : strokeColor
        }

        strokeWidth={isAspect ? 1 : 2}
      />

      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={isRoot ? "#ffffff" : "#333"}
        fontWeight={isAspect || isRoot ? "bold" : "normal"}
      >
        {node.label}
      </text>

    </g>
  );
}