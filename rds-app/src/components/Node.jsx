export default function Node({ node, onToggle, collapsed }) {

  // ----------------------------
  // TRUNCATE TEKST (…)
  // ----------------------------
  function truncateText(text, maxLength = 28) {
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

    const aspectSymbols = ["=", "-", "%", "%%", "#"];
    if (aspectSymbols.includes(parts[0]) && parts.length >= 2) {
      return { prefix: parts[0] + parts[1], rest: parts.slice(2).join(" ") };
    }

    return { prefix: parts[0], rest: parts.slice(1).join(" ") };
  }

  const { prefix, rest } = splitLabel(truncatedLabel);


  // ----------------------------
  // DESIGN SETTINGS 
  // ----------------------------
  const BOX_WIDTH = 190;
  const BOX_HEIGHT = 22;

  const STRIPE_WIDTH = 6;
  const TEXT_PADDING = 8;

  const FONT_SIZE = 11;

  // ----------------------------
  // COLOR SETTINGS
  // ----------------------------
  const aspectColors = {
    "%": "#4da3ff",
    "=": "#ff8c5a",
    "-": "#6ccf4f",
    "%%": "#9b8cff"
  };

  const aspectHeaderColors = {
    "%": "#cfe8ff",
    "=": "#ffd6bf",
    "-": "#dff5dc",
    "%%": "#e6ddff"
  };

  const aspect = node.aspect;
  const strokeColor = aspectColors[aspect] || "#999";

  // ----------------------------
  // TYPE NODER
  // ----------------------------
  const isAspect = node.id?.startsWith("aspect_");
  const isRoot = node.type === "root";
  const aspectKey = isAspect ? node.id.replace("aspect_", "") : null;
  const hasChildren = node.children && node.children.length > 0;

  //Collapse knapp poisjonering
  const BTN_R = 4;
  const btnX = node.x + BOX_WIDTH / 2 + BTN_R + 4;
  const btnY = node.y;

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
        rx={2}

        fill={
          isRoot
            ? "#1e3a8a"
            : isAspect
            ? aspectHeaderColors[aspectKey] || "#eee"
            : "#f8f8f8"
        }

        stroke={
          isRoot
            ? "#1e3a8a"
            : isAspect
            ? "#bbb"
            : strokeColor
        }

        strokeWidth={isAspect ? 1 : 1.5}
      />

      {/* ----------------------------
          COLOR STRIPE
      ---------------------------- */}
      {!isAspect && !isRoot && (
        <rect
          x={node.x - BOX_WIDTH / 2}
          y={node.y - BOX_HEIGHT / 2}
          width={STRIPE_WIDTH}
          height={BOX_HEIGHT}
          fill={strokeColor}
        />
      )}

      {/* ----------------------------
          TEXT
      ---------------------------- */}
      <text
      x={
        isAspect || isRoot
          ? node.x
          : node.x - BOX_WIDTH / 2 + STRIPE_WIDTH + TEXT_PADDING
      }
      y={node.y}
      textAnchor={isAspect || isRoot ? "middle" : "start"}
      dominantBaseline="middle"
      fontSize={isAspect ? 13 : FONT_SIZE}   
      fontFamily="Roboto, Segoe UI, Arial, sans-serif"
      fill={isRoot ? "#ffffff" : "#333"}
      fontWeight="bold"
    >
      {isAspect || isRoot ? (
        node.label
      ) : (
    <>
      <tspan fontWeight="bold">{prefix}</tspan>
      {rest && (
        <tspan dx="6" fontWeight="normal">{rest}</tspan>
      )}
    </>
  )}
</text>
   {/* COLLAPSE/EXPAND Button */}
      {hasChildren && !isRoot && !isAspect && (
        <g
          style={{ cursor: "pointer" }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onToggle && onToggle(node.id)}
        >
          <circle cx={btnX} cy={btnY} r={BTN_R} fill="white" stroke="#999" strokeWidth={1} />
          <text
            x={btnX}
            y={btnY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#999"
          >
            {collapsed ? "+" : "−"}
          </text>
        </g>
      )}



    </g>
  );
}