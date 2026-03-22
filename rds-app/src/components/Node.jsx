/* 
Får inn node (med x, y, label)
Tegner en boks + tekst
 */

export default function Node({ node }) {

    const label = node.id

    return (
  
      <g transform={`translate(${node.x}, ${node.y})`}>
  
        <rect
          width="140"
          height="40"
          rx="8"
          fill="#e3f2fd"
          stroke="#333"
        />
  
        <text
          x="70"
          y="24"
          textAnchor="middle"
        >
          {label}
        </text>
  
      </g>
  
    )
  
  }