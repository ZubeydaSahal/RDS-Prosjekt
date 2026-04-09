export function transformGraph(graph) {
    if (!graph || !graph.aspects) return null;
  
    const nodes = [];
    const nodeMap = {};
  
    const root = {
      id: "root",
      label: "System",
      type: "root"
    };
  
    // ----------------------------
    // NODES (IKKE hardkod rekkefølge!)
    // ----------------------------
    Object.entries(graph.aspects).forEach(([aspect, list]) => {
      (list || []).forEach(n => {
        const node = {
          id: n.id,
          aspect,
          metadata: n.metadata || n.name,
          name: n.name,
          type: "node"
        };
  
        nodes.push(node);
        nodeMap[n.id] = node;
      });
    });
  
    // ----------------------------
    // HIERARCHY
    // ----------------------------
    const hierarchyEdges = [];
  
    nodes.forEach(node => {
      const parentId = node.id.split(".").slice(0, -1).join(".");
  
      if (nodeMap[parentId]) {
        hierarchyEdges.push({
          from: parentId,
          to: node.id,
          type: "hierarchy"
        });
      }
    });
  
    // ----------------------------
    // ROOT EDGES (genereres senere i layout)
    // ----------------------------
    const rootEdges = [];
  
    // ----------------------------
    // CROSS RELATIONS
    // ----------------------------
    const crossEdges = (graph.relations || [])
      .filter(r => r.from !== r.to)
      .map(r => ({
        from: r.from,
        to: r.to,
        type: "cross"
      }));
  
    return {
      root,
      nodes,
      hierarchyEdges,
      rootEdges,
      crossEdges
    };
  }