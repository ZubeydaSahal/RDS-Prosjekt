import { useMemo, useState } from "react";
import { layoutTree } from "../graph/layout";
import { transformGraph } from "./transformGraph";

import Node from "./Node";
import Edge from "./Edge";


export default function GraphView({ graph, graphRef, aspectOrder }) {

  const [fitView, setFitView] = useState(true);

  const [zoom, setZoom] = useState(1);

  const handleWheel = (e) => {
    if (fitView) return;
    if (e.ctrlKey) {
      e.preventDefault();
    }
    e.preventDefault();
    e.stopPropagation();

    const scaleFactor = 0.005;
    const newZoom = zoom - e.deltaY * scaleFactor;

    setZoom(Math.min(3, Math.max(0.2, newZoom)));
  };

  const layout = useMemo(() => {

    if (!graph) {
      return { nodes: [], hierarchyEdges: [] };
    }

    const transformed = transformGraph(graph);
    if (!transformed) {
      return { nodes: [], hierarchyEdges: [] };
    }

    return layoutTree({
      ...transformed,},
      aspectOrder
    );

  }, [graph, aspectOrder]);

  const nodes = layout.nodes || [];
  const relations = layout.hierarchyEdges || [];

  const nodeMap = Object.fromEntries(
    nodes.map(node => [node.id, node])
  );

  const rootNode = nodes.find(n => n.type === "root");
  const aspectNodes = nodes.filter(n => n.type === "aspect");

  const busY = aspectNodes.length > 0
    ? Math.max(...aspectNodes.map(n => n.y)) + 30
    : 160;

  const minX = Math.min(...nodes.map(n => n.x || 0), 0);
  const maxX = Math.max(...nodes.map(n => n.x || 0), 1400);
  const minY = Math.min(...nodes.map(n => n.y || 0), 0);
  const maxY = Math.max(...nodes.map(n => n.y || 0), 800);

  const padding = 50;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  return (
      <div ref={graphRef}
           className="graph-container"
           style={{
             overflow: fitView ? "hidden" : "auto",
           }}
      >

        <button className={"scroll-mode"} onClick={() => setFitView(!fitView)}>
          {fitView ? "Scroll mode" : "Fit to screen"}
        </button>

        <svg
            width={fitView ? "100%" : width}
            height={fitView ? "100%" : height}
            viewBox={
              fitView
                  ? `${minX - padding} ${minY - padding} ${width} ${height}`
                  : undefined
            }
            onWheelCapture={handleWheel}
            preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`scale(${zoom})`}>


          {/* BUS */}
          {aspectNodes.length > 0 && (() => {
            const xs = aspectNodes.map(n => n.x);
            const minBusX = Math.min(...xs);
            const maxBusX = Math.max(...xs);

            return (
                <>
                  {rootNode && (
                      <line
                          x1={rootNode.x}
                          y1={rootNode.y + 20}
                          x2={rootNode.x}
                          y2={busY - 60}
                          stroke="#999"
                          strokeWidth={2}
                      />
                  )}
                  <line x1={minBusX} y1={busY - 60} x2={maxBusX} y2={busY - 60} stroke="#999" strokeWidth={2}/>
                  {aspectNodes.map(node => (
                      <line
                          key={node.id}
                          x1={node.x}
                          y1={busY - 60}
                          x2={node.x}
                          y2={node.y - 20}
                          stroke="#999"
                          strokeWidth={2}
                      />
                  ))}
                </>
            );
          })()}

          {/* EDGES */}
          {relations.map((edge, index) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];

            if (!from || !to) return null;

            return (
                <Edge
                    key={`${edge.from}-${edge.to}-${index}`}
                    from={from}
                    to={to}
                    type={edge.type}
                    busY={busY}
                    allNodes={nodes}
                />
            );
          })}

          {/* NODES */}
          {nodes.map(node => (
              <Node key={node.id} node={node}/>
          ))}
          </g>
        </svg>
      </div>
  )
      ;
}