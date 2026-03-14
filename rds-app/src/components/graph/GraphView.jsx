import { useMemo } from "react"
import { layoutTree } from "../../graph/layout"

import Node from "./Node"
import Edge from "./Edge"

export default function GraphView({ graph }) {

  const layout = useMemo(() => {

    if (!graph) return { nodes: [], relations: [] }

    const result = layoutTree(graph)

    console.log("result of layoutTree:", result)
    return result

  }, [graph])

  const nodes = layout.nodes || []
  /*
  const nodes = graph.nodes.map((n, i) => ({
    ...n,
    x: 200,
    y: 100 + i * 80
  }))
   */

  const relations = layout.hierarchyEdges || []
  /*
  const relations = (layout.relations || []).map(r => ({
    from: r.from ?? r.nodeA?.id,
    to: r.to ?? r.nodeB?.id,
    type: r.type
  }))
   */

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