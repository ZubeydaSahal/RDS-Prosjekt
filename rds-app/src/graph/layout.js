export function layoutTree(graph) {

  if (!graph || !graph.nodes || !graph.root) {
    console.log("Ugyldig graph");
    return { nodes: [], hierarchyEdges: [] };
  }

  // ENDRING: hent collapsedNodes fra graph
  const collapsedNodes = graph.collapsedNodes || new Set();

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

  if (graph.aspectOrder && graph.aspectOrder.length) {
    aspects = graph.aspectOrder
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
  // NODE MAP
  // ----------------------------
  const nodeMap = {};
  graph.nodes.forEach(n => {
    nodeMap[n.id] = { ...n, children: [] };
  });

  // ----------------------------
  // PARENT LOGIKK
  // ----------------------------
  const generatedHierarchyEdges = [];

  graph.nodes.forEach(n => {
    const lastDotIndex = n.id.lastIndexOf(".");
    if (lastDotIndex === -1) return;

    const parentId = n.id.substring(0, lastDotIndex);
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
      const hasParent = generatedHierarchyEdges.some(e => e.to === n.id);
      return !hasParent;
    });
  });

  // ----------------------------
  // LAYOUT MED COLLAPSE-STØTTE
  // ----------------------------
  const ROW_GAP = 70;
  const INDENT = 40;

  // Samle alle synlige kanter
  const visibleHierarchyEdges = [];

  aspects.forEach((aspect) => {

    let currentY = 180;

    function dfs(node, depth) {

      const name = node.name || node.label || "";
      const label = node.id
        ? node.description
          ? `${node.id} ${name} (${node.description})`
          : `${node.id} ${name}`
        : "";

      const isCollapsed = collapsedNodes.has(node.id);

      nodes.push({
        ...node,
        label,
        x: COLUMN_X[aspect.id] + depth * INDENT,
        y: currentY,
        // ENDRING: send med children og collapsed-state til Node.jsx
        children: node.children,
        collapsed: isCollapsed
      });

      currentY += ROW_GAP;

      // ENDRING: ikke tegn barn hvis node er kollapset
      if (!isCollapsed) {
        node.children.forEach(child => {
          // legg til kant kun hvis ikke kollapset
          visibleHierarchyEdges.push({
            from: node.id,
            to: child.id,
            type: "hierarchy"
          });
          dfs(child, depth + 1);
        });
      }
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
      ...visibleHierarchyEdges,
      ...backendEdges
    ]
  };
}