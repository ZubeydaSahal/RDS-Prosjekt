export function layoutTree(graph) {

  // ----------------------------
  // VALIDATION
  // ----------------------------
  if (!graph || !graph.nodes || !graph.root) {
    return {
      nodes: [],
      hierarchyEdges: [],
      rootEdges: [],
      crossEdges: []
    };
  }

  // ----------------------------
  // OUTPUT
  // ----------------------------
  const nodes = [];

  // BRUK edges fra transformGraph (IKKE bygg på nytt)
  const hierarchyEdges = graph.hierarchyEdges || [];
  const rootEdges = graph.rootEdges || [];
  const crossEdges = graph.crossEdges || [];

  // ----------------------------
  // CONFIG (layout spacing)
  // ----------------------------
  const CONFIG = {
    startX: 200,
    columnWidth: 300,
    indent: 40,
    rowGap: 70,
    startY: 180
  };

  // ----------------------------
  // ASPECT ORDER (fra frontend)
  // ----------------------------
  const ORDER = graph.aspectOrder || ["%", "=", "-", "%%"];

  const ASPECT_LABELS = {
    "%": "Typeaspekt",
    "=": "Funksjonsaspekt",
    "-": "Produktaspekt",
    "%%": "Typeaspekt (produkt)"
  };

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
  // ASPECT COLUMNS
  // ----------------------------
  const aspects = ORDER.map(id => ({
    id,
    label: ASPECT_LABELS[id]
  }));

  // ----------------------------
  // X POSITION PER ASPECT
  // ----------------------------
  const COLUMN_X = {};

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect.id] =
      CONFIG.startX + index * CONFIG.columnWidth;
  });

  // ----------------------------
  // ASPECT HEADERS
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
  // GROUP NODES PER ASPECT
  // ----------------------------
  const nodesByAspect = {};

  aspects.forEach(a => {
    nodesByAspect[a.id] = graph.nodes.filter(
      n => n.aspect === a.id
    );
  });

  // ----------------------------
  // LAYOUT PER ASPECT (TREE)
  // ----------------------------
  aspects.forEach((aspect) => {

    const aspectNodes = nodesByAspect[aspect.id];
    if (!aspectNodes.length) return;

    // ----------------------------
    // NODE MAP + CHILDREN
    // ----------------------------
    const nodeMap = {};

    aspectNodes.forEach(n => {
      nodeMap[n.id] = {
        ...n,
        children: []
      };
    });

    // ----------------------------
    // BUILD TREE STRUCTURE
    // ----------------------------
    aspectNodes.forEach(n => {
      const parentId = n.id.split(".").slice(0, -1).join(".");

      if (nodeMap[parentId]) {
        nodeMap[parentId].children.push(nodeMap[n.id]);
      }
    });

    // ----------------------------
    // ROOT NODES (no parent)
    // ----------------------------
    const roots = aspectNodes.filter(n => {
      const parentId = n.id.split(".").slice(0, -1).join(".");
      return !nodeMap[parentId];
    });

    // ----------------------------
    // DFS LAYOUT
    // ----------------------------
    let currentY = CONFIG.startY;

    const visited = new Set(); //  unngå duplikater

    function dfs(node, depth) {

      const visitKey = `${node.aspect}-${node.id}`;

      if (visited.has(visitKey)) return;
      visited.add(visitKey);

      // ----------------------------
      // LABEL
      // ----------------------------
      const label = node.metadata
        ? `${node.id} (${node.metadata})`
        : node.name
          ? `${node.id} (${node.name})`
          : node.id;

      // ----------------------------
      // ADD NODE WITH POSITION
      // ----------------------------
      nodes.push({
        ...node,
        label,
        x: COLUMN_X[aspect.id] + depth * CONFIG.indent,
        y: currentY
      });

      currentY += CONFIG.rowGap;

      // ----------------------------
      // CHILDREN
      // ----------------------------
      node.children.forEach(child =>
        dfs(child, depth + 1)
      );
    }

    // ----------------------------
    // START DFS
    // ----------------------------
    roots.forEach(root =>
      dfs(nodeMap[root.id], 0)
    );

  });

  // ----------------------------
  // RETURN EVERYTHING
  // ----------------------------
  return {
    nodes,
    hierarchyEdges, // fra transformGraph
    rootEdges,      // fra transformGraph
    crossEdges      // fra backend
  };
}