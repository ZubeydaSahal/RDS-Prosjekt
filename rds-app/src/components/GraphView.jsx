import { useMemo, useState } from "react";
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


  const [fitView, setFitView] = useState(true);
  // plasser trestukturen innenfor boksen både vertikalt og horisontalt 
  const minX = Math.min(...nodes.map(n => n.x || 0), 0);
const maxX = Math.max(...nodes.map(n => n.x || 0), 1400);

const minY = Math.min(...nodes.map(n => n.y || 0), 0);
const maxY = Math.max(...nodes.map(n => n.y || 0), 800);

// padding rundt grafen
const padding = 100;

const width = maxX - minX + padding * 2;
const height = maxY - minY + padding * 2;

  return (
   <div className="graph-container">
    
    <button onClick={() => setFitView(!fitView)}>
  {fitView ? "Scroll mode" : "Fit to screen"}
</button>

<svg
  width={fitView ? "100%" : width}
  height={fitView ? 600 : height}
  viewBox={
    fitView
      ? `${minX - padding} ${minY - padding} ${width} ${height}`
      : undefined
  }
  preserveAspectRatio="xMidYMid meet"
>   // scroll i trestukturen

  
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
   </div>
  );
}