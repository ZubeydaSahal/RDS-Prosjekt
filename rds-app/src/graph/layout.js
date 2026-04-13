export function layoutTree(graph, aspectOrder) {

  if (!graph || !graph.nodes || !graph.root) {
    console.log("Ugyldig graph");
    return { nodes: [], hierarchyEdges: [] };
  }

  const nodes = [];

  const backendEdges = (graph.relations || []).filter(
    e => e.type !== "hierarchy"
  );

  // ----------------------------
  // ROOT
  // ----------------------------
  nodes.push({
    ...graph.root,
    x: 700,
    y: 40,
    type: "root"
  });

  // ----------------------------
  // ASPEKTER
  // ----------------------------
  let aspects;

  if (aspectOrder) {
    console.log("===== ASpect order: "+aspectOrder + " ===============")
    aspects = aspectOrder
        //console.log(graph.aspects)
      .map(id => graph.aspects.find(a => a.id === id))
      .filter(Boolean);
  } else {
    aspects = [...graph.aspects].sort((a, b) => a.order - b.order);
  }

  const COLUMN_X = {};

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect.id] = 150 + index * 350;
  });

  // ----------------------------
  // 🆕 NAVN PÅ ASPEKTER
  // ----------------------------
  const ASPECT_NAMES = {
    "%": "Typeaspekt",
    "=": "Funksjonsaspekt",
    "-": "Produktaspekt",
    "%%": "Typeaspekt (produkt)"
  };

  // ----------------------------
  // ASPEKT HEADERS
  // ----------------------------
  console.log(aspects)
  aspects.forEach((aspect) => {
    nodes.push({
      id: "aspect_" + aspect.id,
      label: ASPECT_NAMES[aspect.id] || aspect.label, 
      x: COLUMN_X[aspect.id],
      y: 120,
      type: "aspect"
    });
  });
  console.log(aspects)

  // ----------------------------
  // NODE MAP
  // ----------------------------
  const nodeMap = {};
  graph.nodes.forEach(n => {
    nodeMap[n.id] = { ...n, children: [] };
  });

  // ----------------------------
  // RIKTIG PARENT LOGIKK
  // ----------------------------
  const generatedHierarchyEdges = [];

  graph.nodes.forEach(n => {

    const lastDotIndex = n.id.lastIndexOf(".");

    if (lastDotIndex === -1) return; // ingen parent

    const parentId = n.id.substring(0, lastDotIndex);

    // KUN hvis parent faktisk finnes
    if (!nodeMap[parentId]) return;

    nodeMap[parentId].children.push(nodeMap[n.id]);

    generatedHierarchyEdges.push({
      from: parentId,
      to: n.id,
      type: "hierarchy"
    });
  });

  // ----------------------------
  // ROOT NODER PER ASPEKT
  // ----------------------------
  const rootsByAspect = {};

  aspects.forEach(a => {
    rootsByAspect[a.id] = graph.nodes.filter(n => {

      if (n.aspect !== a.id) return false;

      const hasParent = generatedHierarchyEdges.some(e =>
        e.to === n.id
      );

      return !hasParent;
    });
  });

  // ----------------------------
  // LAYOUT
  // ----------------------------
  const ROW_GAP = 45;
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
        x: COLUMN_X[aspect.id] + depth * 20,
        y: currentY
      });

      currentY += ROW_GAP;

      node.children.forEach(child => {
        dfs(child, depth + 1);
      });
    }

    rootsByAspect[aspect.id].forEach(rootNode => {
      dfs(nodeMap[rootNode.id], 0);
    });

  });

  // ----------------------------
  // RETURN
  // ----------------------------
  return {
    nodes,
    hierarchyEdges: [
      ...generatedHierarchyEdges,
      ...backendEdges
    ]
  };
}