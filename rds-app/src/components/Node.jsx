export default function Node({ node }) {

  // ----------------------------
  // TEKST
  // ----------------------------
  const text = node.label || "";

  const MAX_TEXT_LENGTH = 25;

  const displayText =
    text.length > MAX_TEXT_LENGTH
      ? text.slice(0, MAX_TEXT_LENGTH) + "..."
      : text;

  // ----------------------------
  // BOKS STØRRELSE
  // ----------------------------
  const CHAR_WIDTH = 7;
  const BOX_PADDING_X = 16;
  const BOX_HEIGHT = 30;

  const MIN_WIDTH = 120;
  const MAX_WIDTH = 220;

  const boxWidth = Math.min(
    MAX_WIDTH,
    Math.max(
      MIN_WIDTH,
      displayText.length * CHAR_WIDTH + BOX_PADDING_X * 2
    )
  );

  // ----------------------------
  // ASPEKT
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

  const isAspect = node.id?.startsWith("aspect_");
  const isRoot = node.type === "root";

  const aspectKey = isAspect
    ? node.id.replace("aspect_", "")
    : null;

  return (
    <g>

      {/* BOKS */}
      <rect
        x={node.x - boxWidth / 2}
        y={node.y - BOX_HEIGHT / 2}
        width={boxWidth}
        height={BOX_HEIGHT}
        rx={8}
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

      {/* TEKST */}
      <text
        x={node.x}
        y={node.y + 4}
        textAnchor="middle"
        fontSize="12"
        fill={isRoot ? "#ffffff" : "#333"}
        fontWeight={isAspect || isRoot ? "bold" : "normal"}
      >
        {displayText}
      </text>

    </g>
  );
}