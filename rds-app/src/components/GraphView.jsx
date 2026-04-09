import { useMemo, useState } from "react";
import { layoutTree } from "../graph/layout";
import { transformGraph } from "./transformGraph";

import Node from "./Node";
import Edge from "./Edge";

export default function GraphView({ graph, graphRef }) {

  // STATE FOR REKKEFØLGE
  const [order, setOrder] = useState(["%", "=", "-", "%%"]);


  function moveAspect(id, direction) {

    const index = order.indexOf(id);
    if (index === -1) return;

    const newOrder = [...order];

    const swapIndex =
      direction === "left" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= order.length) return;

    [newOrder[index], newOrder[swapIndex]] =
      [newOrder[swapIndex], newOrder[index]];

    setOrder(newOrder);
  }

  // ----------------------------
  // LAYOUT
  // ----------------------------
  const layout = useMemo(() => {

    if (!graph) {
      return { nodes: [], hierarchyEdges: [], rootEdges: [], crossEdges: [] };
    }

    const transformed = transformGraph(graph);
    if (!transformed) {
      return { nodes: [], hierarchyEdges: [], rootEdges: [], crossEdges: [] };
    }

    return layoutTree({
      ...transformed,
      aspectOrder: order 
    });

  }, [graph, order]);

  const {
    nodes = [],
    hierarchyEdges = [],
    rootEdges = [],
    crossEdges = []
  } = layout;

  const nodeMap = Object.fromEntries(
    nodes.map(n => [n.id, n])
  );

  const [fitView, setFitView] = useState(true);

  const padding = 100;

  const minX = Math.min(...nodes.map(n => n.x || 0), 0);
  const maxX = Math.max(...nodes.map(n => n.x || 0), 1400);
  const minY = Math.min(...nodes.map(n => n.y || 0), 0);
  const maxY = Math.max(...nodes.map(n => n.y || 0), 800);

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  return (
    <div ref={graphRef} className="graph-container">

      {/* 🔥 KNAPPER */}
      <div style={{ marginBottom: 10 }}>
        {order.map(a => (
          <span key={a} style={{ marginRight: 10 }}>
            {a}
            <button onClick={() => moveAspect(a, "left")}>←</button>
            <button onClick={() => moveAspect(a, "right")}>→</button>
          </span>
        ))}
      </div>

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
      >

        {/* ROOT */}
        {rootEdges.map(edge => (
          <Edge
            key={`root-${edge.to}`}
            from={nodeMap[edge.from]}
            to={nodeMap[edge.to]}
            type="root"
            allNodes={nodes}
          />
        ))}

        {/* HIERARCHY */}
        {hierarchyEdges.map(edge => (
          <Edge
            key={`h-${edge.from}-${edge.to}`}
            from={nodeMap[edge.from]}
            to={nodeMap[edge.to]}
            type="hierarchy"
          />
        ))}

        {/* CROSS */}
        {crossEdges.map(edge => (
          <Edge
            key={`c-${edge.from}-${edge.to}`}
            from={nodeMap[edge.from]}
            to={nodeMap[edge.to]}
            type="cross"
          />
        ))}

        {/* NODES */}
        {nodes.map(node => (
          <Node key={node.id} node={node} />
        ))}

      </svg>
    </div>
  );
}