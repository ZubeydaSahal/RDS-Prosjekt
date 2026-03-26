export function layoutTree(graph) {

  // ----------------------------
  // VALIDERING AV INPUT
  // ----------------------------
  // Sikrer at backend-data er gyldig før vi tegner
  if (!graph || !graph.nodes || !graph.root) {
    console.log("Ugyldig graph");
    return { nodes: [], hierarchyEdges: [] };
  }

  console.log("Graph input:", graph);

  // Lister som skal returneres til GraphView
  const nodes = [];

  // Hent relasjoner direkte fra backend (frontend skal ikke bygge disse)
  const hierarchyEdges = graph.relations || [];


  // ----------------------------
  // ROOT NODE (toppnode)
  // ----------------------------
  nodes.push({
    ...graph.root,
    x: 700,
    y: 40,
    type: "root"
  });


  // ----------------------------
  // ASPEKTER (rekkefølge styres av frontend)
  // ----------------------------
  let aspects;

  if (graph.aspectOrder && graph.aspectOrder.length) {

    aspects = graph.aspectOrder
      .map(id => graph.aspects.find(a => a.id === id))
      .filter(Boolean);

  } else if (graph.aspects) {

    aspects = [...graph.aspects]
      .sort((a, b) => a.order - b.order);

  }

  console.log("Aspects:", aspects);


  // ----------------------------
  // LAGER X-POSISJON (KOLONNER)
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
  // GRUPPER NODER PER ASPEKT
  // ----------------------------
  const nodesByAspect = {};

  aspects.forEach(a => {
    nodesByAspect[a.id] = [];
  });

  graph.nodes.forEach(node => {
    if (nodesByAspect[node.aspect]) {
      nodesByAspect[node.aspect].push(node);
    }
  });


  // ----------------------------
  // TRE PER ASPEKT (KOLONNE)
  // ----------------------------
  const ROW_GAP = 80;
  const INDENT = 40;

  aspects.forEach((aspect) => {

    let currentRow = 0;

    // Lager parent → children struktur
    const localMap = {};

    nodesByAspect[aspect.id].forEach(n => {
      localMap[n.id] = { ...n, children: [] };
    });

    const localRoots = [];

    nodesByAspect[aspect.id].forEach(n => {

      const parts = n.id.split(".");
      parts.pop();

      const parentId = parts.join(".");

      if (localMap[parentId]) {
        localMap[parentId].children.push(localMap[n.id]);
      } else {
        localRoots.push(localMap[n.id]);
      }

    });

    // ----------------------------
    // REKURSIV TEGNING
    // ----------------------------
    function layoutNode(node, depth) {

      const name = node.name || node.label || "";

      const label = node.id
        ? node.description
          ? `${node.id} ${name} (${node.description})`
          : `${node.id} ${name}`
        : "";

      nodes.push({
        ...node,
        label,

        // kolonne + indent for barn
        x: COLUMN_X[aspect.id] + depth * INDENT,

        y: 200 + currentRow * ROW_GAP
      });

      currentRow++;

      node.children.forEach(child => {
        layoutNode(child, depth + 1);
      });
    }

    localRoots.forEach(rootNode => {
      layoutNode(rootNode, 0);
    });

  });


  // ----------------------------
  // RETURNER RESULTAT
  // ----------------------------
  console.log("Final nodes:", nodes);
  console.log("Final edges:", hierarchyEdges);

  return {
    nodes,
    hierarchyEdges
  };
}