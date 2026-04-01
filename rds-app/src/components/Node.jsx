export default function Node({ node }) {

  // ----------------------------
  // SPLITTER TEKST I FLERE LINJER
  // ----------------------------
  // Hindrer at tekst går utenfor boksen
  function splitText(text, maxLength = 18) {
    if (!text) return [];

    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach(word => {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });

    if (currentLine) lines.push(currentLine.trim());

    return lines;
  }


  // ----------------------------
  // GENERER LINJER FRA LABEL
  // ----------------------------
  const lines = splitText(node.label);


  // ----------------------------
  // DYNAMISK BOKS-STØRRELSE
  // ----------------------------
  const BOX_WIDTH = 140;
  const LINE_HEIGHT = 14;
  const PADDING = 10;

  const boxHeight = lines.length * LINE_HEIGHT + PADDING * 2;


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

      {/* ----------------------------
          BOKS
      ---------------------------- */}
      <rect
        x={node.x - BOX_WIDTH / 2}
        y={node.y - boxHeight / 2}
        width={BOX_WIDTH}
        height={boxHeight}
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


      {/* ----------------------------
          MULTILINE TEKST (SVG)
      ---------------------------- */}
      <text
        x={node.x}
        y={node.y - (lines.length - 1) * (LINE_HEIGHT / 2)}
        textAnchor="middle"
        fontSize="12"
        fill={isRoot ? "#ffffff" : "#333"}
        fontWeight={isAspect || isRoot ? "bold" : "normal"}
      >
        {lines.map((line, index) => (
          <tspan
            key={index}
            x={node.x}
            dy={index === 0 ? 0 : LINE_HEIGHT}
          >
            {line}
          </tspan>
        ))}
      </text>

    </g>
  );
}