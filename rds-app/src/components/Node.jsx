export default function Node({ node, onToggle, collapsed }) {

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
    if (parts.length === 1) return { prefix: parts[0], rest: "" };
    const prefix = parts.shift();
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
  const hasChildren = node.children && node.children.length > 0;

  const aspectKey = isAspect ? node.id.replace("aspect_", "") : null;

  // ----------------------------
  // EXPAND/COLLAPSE KNAPP
  // ----------------------------
  const BTN_SIZE = 14;
  const btnX = node.x - BOX_WIDTH / 2 - BTN_SIZE / 2;
  const btnY = node.y - BTN_SIZE / 2;

  return (
    <g>

      {/* TOOLTIP */}
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
          TEKST
      ---------------------------- */}
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={isRoot ? "#ffffff" : "#333"}
      >
        <tspan fontWeight="bold">{prefix}</tspan>
        {rest && (
          <tspan dx="6" fontWeight="normal">{rest}</tspan>
        )}
      </text>

      {/* ----------------------------
          EXPAND/COLLAPSE KNAPP
          Vises bare hvis noden har barn
      ---------------------------- */}
      {hasChildren && !isRoot && !isAspect && (
        <g
          style={{ cursor: "pointer" }}
          onClick={() => onToggle && onToggle(node.id)}
        >
          {/* Sirkel */}
          <circle
            cx={btnX}
            cy={node.y}
            r={BTN_SIZE / 2}
            fill="white"
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          {/* + eller - */}
          <text
            x={btnX}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fontWeight="bold"
            fill={strokeColor}
          >
            {collapsed ? "+" : "−"}
          </text>
        </g>
      )}

    </g>
  );
}