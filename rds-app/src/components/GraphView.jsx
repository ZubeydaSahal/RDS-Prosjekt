import { useMemo, useState } from "react";
import { layoutTree } from "../graph/layout";

import Node from "./Node";
import Edge from "./Edge";


export default function GraphView({ graph, aspectOrder }) {

  // Beregner layout kun når graph eller rekkefølge endres
  const layout = useMemo(() => {

    // Hvis ingen data, returner tom struktur
    if (!graph) {
      return { nodes: [], hierarchyEdges: [] };
    }

    // Sender både graph (backend-data) og aspectOrder (frontend-visning)
    return layoutTree({
      ...graph,
      aspectOrder
    });

  }, [graph, aspectOrder]);


  // Hent noder og edges fra layout
  const nodes = layout.nodes || [];
  const relations = layout.hierarchyEdges || [];


  // Lager oppslagskart for rask tilgang til noder via id
  const nodeMap = Object.fromEntries(
    nodes.map(node => [node.id, node])
  );


  // State for visning (fit vs scroll)
  const [fitView, setFitView] = useState(true);


  // Finn ytterpunkter i grafen (brukes til zoom/fit)
  const minX = Math.min(...nodes.map(n => n.x || 0), 0);
  const maxX = Math.max(...nodes.map(n => n.x || 0), 1400);

  const minY = Math.min(...nodes.map(n => n.y || 0), 0);
  const maxY = Math.max(...nodes.map(n => n.y || 0), 800);


  // Padding rundt grafen
  const padding = 100;

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;


  return (
    <div id="graph-wrapper" className="graph-container">

      {/* Knapp for å bytte visning */}
      <button onClick={() => setFitView(!fitView)}>
        {fitView ? "Scroll mode" : "Fit to screen"}
      </button>


      {/* SVG som tegner grafen */}
      <svg
        width={fitView ? "100%" : width}
        height={fitView ? 600 : height}
        viewBox={
          fitView
            ? `${minX - padding} ${minY - padding} ${width} ${height}`
            : undefined
        }
        preserveAspectRatio="xMidYMid meet"
      >

        {/* Tegner edges først (bak nodene) */}
        {relations.map((edge, index) => {

          // Hvis edge mangler data, hopp over
          if (!edge.from || !edge.to) return null;

          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];

          // Hvis node ikke finnes, ikke tegn edge
          if (!from || !to) return null;

          return (
            <Edge
              key={`${edge.from}-${edge.to}-${index}`}
              from={from}
              to={to}
              type={edge.type}
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
    </div>
  );
}