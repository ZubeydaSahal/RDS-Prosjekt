import { useMemo, useState } from "react";
import { layoutTree } from "../graph/layout";
import { transformGraph } from "./transformGraph";

import Node from "./Node";
import Edge from "./Edge";

export default function GraphView({ graph, graphRef }) {

  // State for aspekt-rekkefølge
  const [order, setOrder] = useState(["%", "=", "-", "%%"]);

  // State for visning (fit vs scroll)
  const [fitView, setFitView] = useState(true);

  // Flytt aspekt venstre/høyre
  function moveAspect(id, direction) {
    const index = order.indexOf(id);
    if (index === -1) return;

    const next = [...order];
    if (direction === "left" && index > 0) {
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
    }
    if (direction === "right" && index < next.length - 1) {
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
    }
    setOrder(next);
  }

  // Beregner layout kun når graph eller rekkefølge endres
  const layout = useMemo(() => {

    if (!graph) {
      return { nodes: [], hierarchyEdges: [] };
    }

    const transformed = transformGraph(graph);

    if (!transformed) {
      return { nodes: [], hierarchyEdges: [] };
    }

    return layoutTree({
      ...transformed,
      aspectOrder: order
    });

  }, [graph, order]);


  // Hent noder og edges fra layout
  const nodes = layout.nodes || [];
  const relations = layout.hierarchyEdges || [];
  const groups = layout.groups || [];

  // Lager oppslagskart for rask tilgang til noder via id
  const nodeMap = Object.fromEntries(
    nodes.map(node => [node.id, node])
  );

  // Splitt root og andre edges
  const rootEdges = relations.filter(e => e.type === "root");
  const otherEdges = relations.filter(e => e.type !== "root");

  // Finn ytterpunkter i grafen
  const minX = Math.min(...nodes.map(n => n.x || 0), 0);
  const maxX = Math.max(...nodes.map(n => n.x || 0), 1400);
  const minY = Math.min(...nodes.map(n => n.y || 0), 0);
  const maxY = Math.max(...nodes.map(n => n.y || 0), 800);

  const padding = 100;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  // Hent root + aspekter
  const rootNode = nodes.find(n => n.type === "root");
  const aspectNodes = nodes.filter(n => n.type === "aspect");

  // Bus posisjon
  const busY = rootNode ? rootNode.y + 50 : 100;

  // Mappe edge-typer
  function mapEdgeType(type) {
    if (type === "hierarchy") return "hierarchy";
    if (type === "root") return "root";
    return "cross";
  }

  return (
    <div ref={graphRef} className="graph-container">

      {/* Knapper for aspekt-rekkefølge */}
      <div style={{ marginBottom: 10 }}>
        {order.map(a => (
          <span key={a} style={{ marginRight: 10 }}>
            {a}
            <button onClick={() => moveAspect(a, "left")}>←</button>
            <button onClick={() => moveAspect(a, "right")}>→</button>
          </span>
        ))}
      </div>

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

        {/* Bus line (toppnode → aspekter) */}
        {aspectNodes.length > 0 && (() => {

          const xValues = aspectNodes.map(n => n.x);
          const minBusX = Math.min(...xValues);
          const maxBusX = Math.max(...xValues);

          return (
            <>
              {/* Root → bus */}
              {rootNode && (
                <line
                  x1={rootNode.x}
                  y1={rootNode.y + 30}
                  x2={rootNode.x}
                  y2={busY}
                  stroke="#999"
                  strokeWidth={2}
                />
              )}

              {/* Horisontal bus */}
              <line
                x1={minBusX}
                y1={busY}
                x2={maxBusX}
                y2={busY}
                stroke="#999"
                strokeWidth={2}
              />

              {/* Bus → aspekter */}
              {aspectNodes.map(node => (
                <line
                  key={`bus-${node.id}`}
                  x1={node.x}
                  y1={busY}
                  x2={node.x}
                  y2={node.y - 20}
                  stroke="#999"
                  strokeWidth={2}
                />
              ))}
            </>
          );
        })()}

        {/* Tegner edges (bak nodene) */}
        {otherEdges.map((edge, index) => {

          if (!edge.from || !edge.to) return null;

          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];

          if (!from || !to) return null;

          return (
            <Edge
              key={`${edge.from}-${edge.to}-${index}`}
              from={from}
              to={to}
              type={mapEdgeType(edge.type)}
              busY={busY}
              index={index}
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