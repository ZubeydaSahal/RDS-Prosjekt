import { useMemo } from "react"
import { layoutTree } from "../../graph/layout"

import Node from "./Node"
import Edge from "./Edge"

export default function GraphView({ graph }) {

  const nodes = graph?.nodes || []
  const relations = graph?.relations || []

  const layout = useMemo(() => {

    if (!graph) return { nodes: [], relations: [] }

    return layoutTree(graph)

  }, [graph])

  const nodeMap = Object.fromEntries(
    nodes.map(n => [n.id, n])
    )
  
    return (
  
      <svg width="1400" height="800">
  
        {relations.map(edge => {
  
          const from = nodeMap[edge.from]
          const to = nodeMap[edge.to]
  
          if (!from || !to) return null
  
          return (
            <Edge
              key={edge.from + "-" + edge.to}
              from={from}
              to={to}
            />
          )
  
        })}
  
        {nodes.map(node => (
          <Node
            key={node.id}
            node={node}
          />
        ))}
  
      </svg>
  
    )
  }