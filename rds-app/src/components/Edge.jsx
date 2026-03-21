export default function Edge({ from, to, label }) {

    const startX = from.x + 70
    const startY = from.y + 40
  
    const endX = to.x + 70
    const endY = to.y

    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2
    return (
        <g>
            <path
                d={`M ${startX} ${startY} V ${endY} H ${endX}`}
                stroke="#444"
                fill="none"
            />

            {label && (
                <text
                    x={midX}
                    y={midY - 4}
                    textAnchor="middle"
                    fontSize="12"
                >
                    {label}
                </text>
            )}
        </g>
    )
  
  }