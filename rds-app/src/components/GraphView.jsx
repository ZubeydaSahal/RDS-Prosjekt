import { useMemo, useState } from "react";
import { layoutTree } from "../graph/layout";
import { transformGraph } from "./transformGraph";

import Node from "./Node";
import Edge from "./Edge";

const ASPECT_COLORS = {
  "=": "#f97316",
  "%": "#3b82f6",
  "-": "#22c55e",
  "%%": "#a855f7",
};

export default function GraphView({ graph, graphRef, aspectOrder, activeRelation = [] }) {

  const [fitView, setFitView] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());

  // Holder styr på hvilken edge som er hoveret
  const [hoveredEdge, setHoveredEdge] = useState(null);

  // ----------------------------
  // ZOOM 
  // ----------------------------
  const handleWheel = (e) => {
    if (fitView) return;
    if (e.ctrlKey) e.preventDefault();
    e.preventDefault();
    e.stopPropagation();
    const scaleFactor = 0.005;
    const newZoom = zoom - e.deltaY * scaleFactor;
    setZoom(Math.min(3, Math.max(0.2, newZoom)));
  };

  // ----------------------------
  // COLLAPSE 
  // ----------------------------
  function handleToggle(nodeId) {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }

  // ----------------------------
  // LAYOUT 
  // ----------------------------
  const layout = useMemo(() => {
    if (!graph) return { nodes: [], hierarchyEdges: [] };
    const transformed = transformGraph(graph);
    if (!transformed) return { nodes: [], hierarchyEdges: [] };
    return layoutTree({ ...transformed, collapsedNodes }, aspectOrder);
  }, [graph, aspectOrder, collapsedNodes]);

  const nodes = layout.nodes || [];
  const relations = layout.hierarchyEdges || [];

  // ----------------------------
  // FILTER RELASJONER
  // ENDRING: null-type håndteres som "ingen"
  // ----------------------------
  const visibleRelations = relations.filter(edge => {
    if (edge.type === "hierarchy") return true;
    if (!activeRelation.includes("cross")) return false;
    const typeKey = edge.type ?? "ingen";
    if (edge.type && !activeRelation.includes(edge.type)) return false;
    return true;
  });

  
  const nodeMap = Object.fromEntries(nodes.map(node => [node.id, node]));
  const rootNode = nodes.find(n => n.type === "root");
  const aspectNodes = nodes.filter(n => n.type === "aspect");

  const busY = aspectNodes.length > 0
    ? Math.max(...aspectNodes.map(n => n.y)) + 30
    : 160;

  const minX = Math.min(...nodes.map(n => n.x || 0), 0);
  const maxX = Math.max(...nodes.map(n => n.x || 0), 1400);
  const minY = Math.min(...nodes.map(n => n.y || 0), 0);
  const maxY = Math.max(...nodes.map(n => n.y || 0), 800);

  const padding = 150;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  return (
    <div
      ref={graphRef}
      className="graph-container"
      style={{ overflow: fitView ? "hidden" : "auto" }}
    >
      <button className="scroll-mode" onClick={() => setFitView(!fitView)}>
        {fitView ? "Scroll mode" : "Fit to screen"}
      </button>

      <svg
        width={fitView ? "100%" : width}
        height={fitView ? "100%" : height}
        viewBox={fitView ? `${minX - padding} ${minY - padding} ${width} ${height}` : undefined}
        onWheelCapture={handleWheel}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`scale(${zoom})`}>

          {/* BUS SYSTEM rot til aspekt-header */}
          {aspectNodes.length > 0 && (() => {
            const xs = aspectNodes.map(n => n.x);
            const minBusX = Math.min(...xs);
            const maxBusX = Math.max(...xs);
            return (
              <>
                {rootNode && (
                  <line x1={rootNode.x} y1={rootNode.y + 20} x2={rootNode.x} y2={busY - 60} stroke="#999" strokeWidth={2} />
                )}
                <line x1={minBusX} y1={busY - 60} x2={maxBusX} y2={busY - 60} stroke="#999" strokeWidth={2} />
                {aspectNodes.map(node => (
                  <line key={node.id} x1={node.x} y1={busY - 60} x2={node.x} y2={node.y - 20} stroke="#999" strokeWidth={2} />
                ))}
              </>
            );
          })()}

          {/* ASPECT → ROOT NODER */}
          {aspectNodes.map(aspectNode => {
            const aspectKey = aspectNode.id.replace("aspect_", "");
            const color = ASPECT_COLORS[aspectKey] || "#999";

            const rootNodesInColumn = nodes.filter(n => {
              if (n.aspect !== aspectKey) return false;
              if (n.id.startsWith("aspect_")) return false;
              const parentId = n.id.substring(0, n.id.lastIndexOf("."));
              return !nodes.some(p => p.id === parentId);
            });

            if (rootNodesInColumn.length === 0) return null;

            const NODE_HALF = 95;   // BOX_WIDTH / 2 fra Node.jsx
            const NODE_HALF_H = 11; // BOX_HEIGHT / 2 fra Node.jsx
            const DROP = 20;        // piksler ned før svingen til venstre
            const busX = aspectNode.x - NODE_HALF - 15;
            const startY = aspectNode.y + NODE_HALF_H; // bunn-senter av aspektnoden
            const turnY = startY + DROP;               // punkt der linjen svinger til venstre
            const endY = Math.max(...rootNodesInColumn.map(n => n.y));

            return (
              <g key={`aspect-hierarchy-${aspectNode.id}`}>
                {/* Ned fra senter av aspektnode */}
                <line x1={aspectNode.x} y1={startY} x2={aspectNode.x} y2={turnY} stroke={color} strokeWidth={2} />
                {/* Sving til venstre (busX) */}
                <line x1={aspectNode.x} y1={turnY} x2={busX} y2={turnY} stroke={color} strokeWidth={2} />
                {/* Vertikal bus-linje ned til siste root-node */}
                <line x1={busX} y1={turnY} x2={busX} y2={endY} stroke={color} strokeWidth={2} />
                {/* Horisontal linje til venstre kant av hver root-node */}
                {rootNodesInColumn.map(node => (
                  <line key={`to-root-${node.id}`} x1={busX} y1={node.y} x2={node.x - NODE_HALF} y2={node.y} stroke={color} strokeWidth={2} />
                ))}
              </g>
            );
          })}

          {/* LAYER 1: EDGES (bak) */}
          <g>
            {visibleRelations.map((edge, index) => {
              const from = nodeMap[edge.from];
              const to = nodeMap[edge.to];
              if (!from || !to) return null;

              const edgeId = `${edge.from}-${edge.to}-${index}`;
              if (hoveredEdge === edgeId) return null;

              return (
                <Edge
                  key={edgeId}
                  edgeId={edgeId}
                  from={from}
                  to={to}
                  type={edge.type}
                  allNodes={nodes}
                  setHoveredEdge={setHoveredEdge}
                  isHovered={false}
                  index={index}
                />
              );
            })}
          </g>

          {/* LAYER 2: NODES */}
          <g>
            {nodes.map(node => (
              <Node
                key={node.id}
                node={node}
                onToggle={handleToggle}
                collapsed={collapsedNodes.has(node.id)}
              />
            ))}
          </g>

          {/* LAYER 3: HOVERED EDGE (øverst) */}
          <g>
            {visibleRelations.map((edge, index) => {
              const edgeId = `${edge.from}-${edge.to}-${index}`;
              if (edgeId !== hoveredEdge) return null;

              const from = nodeMap[edge.from];
              const to = nodeMap[edge.to];
              if (!from || !to) return null;

              return (
                <Edge
                  key={edgeId}
                  edgeId={edgeId}
                  from={from}
                  to={to}
                  type={edge.type}
                  allNodes={nodes}
                  setHoveredEdge={setHoveredEdge}
                  isHovered={true}
                  index={index}
                />
              );
            })}
          </g>

        </g>
      </svg>
    </div>
  );
}