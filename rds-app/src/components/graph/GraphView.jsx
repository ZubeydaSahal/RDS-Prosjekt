import { useMemo } from "react"
import { layoutTree } from "../../graph/layout"
import { graphToFlow } from "../graphToFlow"

import Node from "./Node"
import Edge from "./Edge"

export default function GraphView({graph}) {

  const graphView = useMemo(() => {

    const layout = layoutTree(graph)

    return layout

  }, [])

  const nodeMap = Object.fromEntries(
    graph.nodes.map(n => [n.id, n])
  )

  return (

    <svg width="1400" height="800">

      {graph.hierarchyEdges.map(edge => {

        const from = nodeMap[edge.from]
        const to = nodeMap[edge.to]

        if (!from || !to) return null

        return (
          <Edge
            key={edge.from + edge.to}
            from={from}
            to={to}
          />
        )

      })}

      {graph.nodes.map(node => (
        <Node key={node.id} node={node} />
      ))}

    </svg>

  )

}