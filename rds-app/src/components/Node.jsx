export default function Node({ node }) {

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
    if (parts.length === 1) {
      return { prefix: parts[0], rest: "" };
    }

    const prefix = parts.shift();
    const rest = parts.join(" ");

    return { prefix, rest };
  }

  const { prefix, rest } = splitLabel(truncatedLabel);

  // ----------------------------
  // DESIGN SETTINGS 
  // ----------------------------
  const BOX_WIDTH = 190;
  const BOX_HEIGHT = 32;

  const STRIPE_WIDTH = 6;
  const TEXT_PADDING = 8;

  const FONT_SIZE = 11;

  // ----------------------------
  // FARGER
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
            ? "#2b448c"
            : isAspect
            ? aspectHeaderColors[aspectKey] || "#eee"
            : "#f8f8f8"
        }

        stroke={
          isRoot
            ? "#2b448c"
            : isAspect
            ? "#bbb"
            : strokeColor
        }

        strokeWidth={isAspect ? 1 : 1.5}
      />

      {/* ----------------------------
          FARGESTRIPE
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
          TEKST
      ---------------------------- */}
      <text
  x={
    isAspect || isRoot
      ? node.x                              // sentrert
      : node.x - BOX_WIDTH / 2 + STRIPE_WIDTH + TEXT_PADDING // venstre
  }
  y={node.y}
  textAnchor={isAspect || isRoot ? "middle" : "start"}
  dominantBaseline="middle"
  fontSize={FONT_SIZE}
  fontFamily="Roboto, Segoe UI, Arial, sans-serif"
  fill={isRoot ? "#ffffff" : "#333"}
>
  {/* orskjellig rendering */}
  {isAspect || isRoot ? (
    node.label   // vanlig tekst (ingen split)
  ) : (
    <>
      <tspan fontWeight="600">
        {prefix}
      </tspan>

      {rest && (
        <tspan dx="6" fontWeight="400">
          {rest}
        </tspan>
      )}
    </>
  )}
</text>

    </g>
  );
}