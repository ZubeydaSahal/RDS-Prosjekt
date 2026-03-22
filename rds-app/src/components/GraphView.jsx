import { useMemo } from "react";
import { layoutTree } from "../graph/layout";

import Node from "./Node";
import Edge from "./Edge";

export default function GraphView({ graph, aspects }) {

  // Beregner layout kun når graph eller aspects endres
  const layout = useMemo(() => {

    // Hvis ingen data, returner tom struktur
    if (!graph) {
      return { nodes: [], hierarchyEdges: [] };
    }

    // Sender både graph og aspects til layout
    return layoutTree({ ...graph, aspects });

  }, [graph, aspects]);

  // Hent noder og edges fra layout
  const nodes = layout.nodes || [];
  const relations = layout.hierarchyEdges || [];

  // Lager oppslagskart for rask tilgang til noder via id
  const nodeMap = Object.fromEntries(
    nodes.map(node => [node.id, node])
  );

  return (
    <svg width="1400" height="800">

      {/* Tegner edges først (bak nodene) */}
      {relations.map((edge, index) => {

        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];

        // Hvis node mangler, ikke tegn edge
        if (!from || !to) return null;

        return (
          <Edge
            key={`${edge.from}-${edge.to}-${index}`}
            from={from}
            to={to}
          />
        );
      })}

      {/* Tegner noder */}
      {nodes.map((node, index) => (
        <Node
          key={`${node.id}-${index}`}
          node={node}
        />
      ))}

    </svg>
  );
}