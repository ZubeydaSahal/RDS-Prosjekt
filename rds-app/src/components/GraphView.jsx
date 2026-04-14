import { useMemo, useState } from "react";
import { layoutTree } from "../graph/layout";
import { transformGraph } from "./transformGraph";

import Node from "./Node";
import Edge from "./Edge";

const ASPECT_COLORS = {
  "=": "#ff9f6e",
  "%": "#4da3ff",
  "-": "#7ed957",
  "%%": "#a78bfa",
};

export default function GraphView({ graph, graphRef, aspectOrder }) {

  const [fitView, setFitView] = useState(true);

  const [collapsedNodes, setCollapsedNodes] = useState(new Set());

  function handleToggle(nodeId) {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }

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
      aspectOrder,
      collapsedNodes
    });

  }, [graph, aspectOrder, collapsedNodes]);

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

  const padding = 100;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  return (
    <div ref={graphRef} className="graph-container">

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

        {/* BUS */}
        {aspectNodes.length > 0 && (() => {
          const xs = aspectNodes.map(n => n.x);
          const minBusX = Math.min(...xs);
          const maxBusX = Math.max(...xs);
          const actualBusY = Math.min(...aspectNodes.map(n => n.y)) - 30;

          return (
            <>
              {rootNode && (
                <line
                  x1={rootNode.x}
                  y1={rootNode.y + 20}
                  x2={rootNode.x}
                  y2={actualBusY}
                  stroke="#999"
                  strokeWidth={2}
                />
              )}
              <line x1={minBusX} y1={actualBusY} x2={maxBusX} y2={actualBusY} stroke="#999" strokeWidth={2} />
              {aspectNodes.map(node => (
                <line
                  key={node.id}
                  x1={node.x}
                  y1={actualBusY}
                  x2={node.x}
                  y2={node.y - 20}
                  stroke="#999"
                  strokeWidth={2}
                />
              ))}
            </>
          );
        })()}

        {/* ENDRING: linjer fra aspekt-header til alle rot-noder i kolonnen */}
        {aspectNodes.map(aspectNode => {
          const aspectKey = aspectNode.label;
          const color = ASPECT_COLORS[aspectKey] || "#999";

          const rootNodesInColumn = nodes.filter(n => {
            if (n.aspect !== aspectKey) return false;
            if (n.id.startsWith("aspect_")) return false;
            // Rot-node = ingen forelder i nodeMap
            const parentId = n.id.substring(0, n.id.lastIndexOf("."));
            return !nodes.some(p => p.id === parentId);
          });

          return rootNodesInColumn.map(node => (
          <>
            {/* vertikal linje fra aspekt ned til node-nivå */}
            <line
              key={`aspect-vert-${node.id}`}
              x1={aspectNode.x - 90}
              y1={aspectNode.y + 20}
              x2={aspectNode.x - 90}
              y2={node.y}
              stroke={color}
              strokeWidth={2}
            />
            {/* horisontal strek inn til noden */}
            <line
              key={`aspect-horiz-${node.id}`}
              x1={aspectNode.x - 90}
              y1={node.y}
              x2={node.x - 95}
              y2={node.y}
              stroke={color}
              strokeWidth={2}
            />
          </>
        ));
        })}

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
              allNodes={nodes}
            />
          );
        })}

        {/* NODES */}
        {nodes.map(node => (
          <Node
            key={node.id}
            node={node}
            onToggle={handleToggle}
            collapsed={collapsedNodes.has(node.id)}
          />
        ))}

      </svg>
    </div>
  );
}