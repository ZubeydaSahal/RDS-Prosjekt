export function layoutTree(graph) {

  if (!graph || !graph.aspects || !graph.relations) {
    console.log("Ugyldig graph");
    return { nodes: [], hierarchyEdges: [] };
  }

  console.log("Graph input:", graph);

  const nodes = [];

  // ----------------------------
  // NORMALISER DATA
  // ----------------------------

  const rootArray = graph.aspects["<root>"] || [];
  const rootNode = rootArray[0];

  const allNodes = Object.values(graph.aspects).flat();

  // Convert backend relations → edges
  const allEdges = (graph.relations || [])
      .filter(r => r?.nodeA?.id && r?.nodeB?.id)
      .map(r => {
        const from = r.nodeA.id;
        const to = r.nodeB.id;

        const sameAspect = from[0] === to[0];

        return {
          from,
          to,
          type: sameAspect ? "hierarchy" : "relation"
        };
      });

  const hierarchyEdges = allEdges.filter(e => e.type === "hierarchy");
  const relationEdges = allEdges.filter(e => e.type === "relation");

  // ----------------------------
  // ROOT NODE
  // ----------------------------
  if (rootNode) {
    nodes.push({
      ...rootNode,
      x: 700,
      y: 40,
      type: "root"
    });
  }

  // ----------------------------
  // ASPEKTER
  // ----------------------------
  let aspects;

  const aspectKeys = Object.keys(graph.aspects).filter(k => k !== "<root>");

  const aspectMeta = aspectKeys.map(key => ({
    id: key,
    label: key
  }));

  if (graph.aspectOrder && graph.aspectOrder.length) {
    aspects = graph.aspectOrder
        .map(id => aspectMeta.find(a => a.id === id))
        .filter(Boolean);
  } else {
    aspects = aspectMeta;
  }

  console.log("Aspects:", aspects);

  // ----------------------------
  // KOLONNER
  // ----------------------------
  const COLUMN_X = {};

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect.id] = 150 + index * 350;
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
  // NODE MAP
  // ----------------------------
  const nodeMap = {};

  allNodes.forEach(n => {
    nodeMap[n.id] = {
      ...n,
      children: [],
      aspect: n.id?.[0] // derive aspect from id prefix (% - =)
    };
  });

  // ----------------------------
  // BUILD TREE FROM RELATIONS
  // ----------------------------

  hierarchyEdges.forEach(e => {
    if (nodeMap[e.from] && nodeMap[e.to]) {
      nodeMap[e.from].children.push(nodeMap[e.to]);
    }
  });

  // ----------------------------
  // ROOTS PER ASPECT
  // ----------------------------
  const rootsByAspect = {};

  aspects.forEach(a => {
    rootsByAspect[a.id] = allNodes.filter(n => {

      if (n.id[0] !== a.id) return false;

      const hasParent = hierarchyEdges.some(e => e.to === n.id);
      return !hasParent;
    });
  });

  // ----------------------------
  // LAYOUT (DFS)
  // ----------------------------
  const ROW_GAP = 70;
  const INDENT = 40;

  aspects.forEach((aspect) => {

    let currentY = 180;

    function dfs(node, depth) {

      const label = node.name
          ? `${node.id} ${node.name}`
          : node.id;

      nodes.push({
        ...node,
        label,
        x: COLUMN_X[aspect.id] + depth * INDENT,
        y: currentY
      });

      currentY += ROW_GAP;

      node.children.forEach(child => {
        dfs(child, depth + 1);
      });
    }

    rootsByAspect[aspect.id].forEach(rootNode => {
      const mapped = nodeMap[rootNode.id];
      if (mapped) dfs(mapped, 0);
    });

  });

  // ----------------------------
  // RETURN
  // ----------------------------
  console.log("Final nodes:", nodes);

  return {
    nodes,
    hierarchyEdges,
    relationEdges
  };
}





