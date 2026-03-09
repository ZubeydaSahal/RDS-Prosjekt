export default function Edge({ from, to }) {

    const startX = from.x + 70
    const startY = from.y + 40
  
    const endX = to.x + 70
    const endY = to.y
  
    return (
  
      <path
        d={`M ${startX} ${startY} V ${endY} H ${endX}`}
        stroke="#444"
        fill="none"
      />
  
    )
  
  }