export default function Node({ node }) {

  console.log(node.id, node.aspect);

  // ----------------------------
  // TRUNCATE TEKST (…)
  // ----------------------------
  function truncateText(text, maxLength = 26) {
    if (!text) return "";

    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + "...";
  }

  const truncatedLabel = truncateText(node.label);


  // ----------------------------
  // SPLITT PREFIX + REST
  // ----------------------------
  function splitLabel(label) {
    if (!label) return { prefix: "", rest: "" };

    const parts = label.split(" ");

    if (parts.length === 1) {
      return { prefix: parts[0], rest: "" };
    }

    const prefix = parts.shift(); // f.eks "=R1"
    const rest = parts.join(" ");

    return { prefix, rest };
  }

  const { prefix, rest } = splitLabel(truncatedLabel);


  // ----------------------------
  // FIXED BOKS-STØRRELSE
  // ----------------------------
  const BOX_WIDTH = 190;
  const BOX_HEIGHT = 42;


  // ----------------------------
  // FINN ASPEKT FRA ID
  // ----------------------------
  const getAspect = (id) => {
    if (!id) return null;

    if (id.startsWith("%%")) return "%%";
    if (id.startsWith("%")) return "%";
    if (id.startsWith("=")) return "=";
    if (id.startsWith("-")) return "-";

    return null;
  };

  const aspect = getAspect(node.id);


  // ----------------------------
  // FARGER
  // ----------------------------
  const aspectColors = {
    "%": "#4da3ff",
    "=": "#ff9f6e",
    "-": "#7ed957",
    "%%": "#a78bfa"
  };

  const aspectHeaderColors = {
    "%": "#cfe8ff",
    "=": "#ffd6bf",
    "-": "#d4f5d0",
    "%%": "#e4d7ff"
  };

  const strokeColor = aspectColors[aspect] || "#888";


  // ----------------------------
  // TYPE NODER
  // ----------------------------
  const isAspect = node.id?.startsWith("aspect_");
  const isRoot = node.type === "root";

  const aspectKey = isAspect ? node.id.replace("aspect_", "") : null;


  return (
    <g>

      {/* TOOLTIP (viser full tekst) */}
      <title>{node.label}</title>

      {/* ----------------------------
          BOKS
      ---------------------------- */}
      <rect
        x={node.x - BOX_WIDTH / 2}
        y={node.y - BOX_HEIGHT / 2}
        width={BOX_WIDTH}
        height={BOX_HEIGHT}
        rx={4}

        fill={
          isRoot
            ? "#1e3a8a"
            : isAspect
            ? aspectHeaderColors[aspectKey] || "#eee"
            : "#ffffff"
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

      {/* ----------------------------
          FARGESTRIPE
      ---------------------------- */}
      {!isAspect && !isRoot && (
        <rect
          x={node.x - BOX_WIDTH / 2}
          y={node.y - BOX_HEIGHT / 2}
          width={6}
          height={BOX_HEIGHT}
          fill={strokeColor}
        />
      )}

      {/* ----------------------------
          TEKST (PREFIX BOLD)
      ---------------------------- */}
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={isRoot ? "#ffffff" : "#333"}
      >
        {/* PREFIX */}
        <tspan fontWeight="bold">
          {prefix}
        </tspan>

        {/* AVSTAND */}
        {rest && (
          <tspan dx="6" fontWeight="normal">
            {rest}
          </tspan>
        )}
      </text>

    </g>
  );
}