export function layoutTree(graph) {

  // ----------------------------
  // VALIDERING AV INPUT
  // ----------------------------
  if (!graph || !graph.nodes || !graph.root) {
    console.log("Ugyldig graph");
    return { nodes: [], hierarchyEdges: [] };
  }

  console.log("Graph input:", graph);

  const nodes = [];

  // Bruk relasjoner direkte fra backend
  const hierarchyEdges = graph.relations || [];

  // ----------------------------
  // ROOT NODE
  // ----------------------------
  nodes.push({
    ...graph.root,
    x: 700,
    y: 40,
    type: "root"
  });

  // ----------------------------
  // ASPEKTER (rekkefølge fra frontend)
  // ----------------------------
  let aspects;

  if (graph.aspectOrder && graph.aspectOrder.length) {
    aspects = graph.aspectOrder
      .map(id => graph.aspects.find(a => a.id === id))
      .filter(Boolean);
  } else if (graph.aspects) {
    aspects = [...graph.aspects].sort((a, b) => a.order - b.order);
  }

  console.log("Aspects:", aspects);

  // ----------------------------
  // KOLONNEPOSISJON
  // ----------------------------
  const COLUMN_X = {};

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect.id] = 150 + index * 350;
  });

  // ----------------------------
  // ASPEKT HEADERS
  // ----------------------------
  aspects.forEach((aspect) => {
    nodes.push({
      id: "aspect_" + aspect.id,
      label: aspect.label,
      x: COLUMN_X[aspect.id],
      y: 120,
      type: "aspect"
    });
  });

  // ----------------------------
  // BYGG NODE-MAP (for DFS)
  // ----------------------------
  const nodeMap = {};
  graph.nodes.forEach(n => {
    nodeMap[n.id] = { ...n, children: [] };
  });

  // ----------------------------
// KOBLE FORELDER → BARN (fra ID)
// ----------------------------
const generatedHierarchyEdges = [];

graph.nodes.forEach(n => {
  const parts = n.id.split(".");
  parts.pop();

  const parentId = parts.join(".");

  if (nodeMap[parentId]) {

    // Koble i tre
    nodeMap[parentId].children.push(nodeMap[n.id]);

    // GENERER EDGE
    generatedHierarchyEdges.push({
      from: parentId,
      to: n.id,
      type: "hierarchy"
    });
  }
});


  // ----------------------------
  // FINN ROOT NODER PER ASPEKT
  // ----------------------------
  const rootsByAspect = {};

  aspects.forEach(a => {
    rootsByAspect[a.id] = graph.nodes.filter(n => {
  
      if (n.aspect !== a.id) return false;
  
      // node er root hvis INGEN peker til den via hierarchy
      const hasParent = hierarchyEdges.some(e =>
        e.to === n.id && e.type === "hierarchy"
      );
  
      return !hasParent;
    });
  });

  // ----------------------------
  // TRE LAYOUT (DFS)
  // ----------------------------
  const ROW_GAP = 70;
  const INDENT = 40;

  aspects.forEach((aspect) => {

    let currentY = 180;

    function dfs(node, depth) {

      const name = node.name || node.label || "";

      const label = node.id
        ? node.description
          ? `${node.id} ${name} (${node.description})`
          : `${node.id} ${name}`
        : "";

      nodes.push({
        ...node,
        label,

        // ----------------------------
        // INDENT BASERT PÅ NIVÅ
        // ----------------------------
        x: COLUMN_X[aspect.id] + depth * INDENT,

        // ----------------------------
        // PLASSERES NEDOVER
        // ----------------------------
        y: currentY
      });

      currentY += ROW_GAP;

      // ----------------------------
      // REKURSIV DFS
      // ----------------------------
      node.children.forEach(child => {
        dfs(child, depth + 1);
      });
    }

    rootsByAspect[aspect.id].forEach(rootNode => {
      dfs(nodeMap[rootNode.id], 0);
    });

  });

  // ----------------------------
  // RETURNER RESULTAT
  // ----------------------------
  console.log("Final nodes:", nodes);

  
  return {
    nodes,
    hierarchyEdges: [
      ...generatedHierarchyEdges,
      ...hierarchyEdges.filter(e => e.type !== "hierarchy")
    ]
  };
} 





