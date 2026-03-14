export function layoutTree(graph) {

  if (!graph) return { nodes: [], hierarchyEdges: [] };

  const nodes = [];
  const hierarchyEdges = [];

  const aspects = [
    { id: "aspect_%", label: "Typeaspekt (%)", type: "%" },
    { id: "aspect_=", label: "Funksjonsaspekt (=)", type: "=" },
    { id: "aspect_-", label: "Produktaspekt (-)", type: "-" },
    { id: "aspect_%%", label: "Typeaspekt (%%)", type: "%%" }
  ];

  const COLUMN_X = {
    "%": 150,
    "=": 450,
    "-": 750,
    "%%": 1050
  };

  const ROW_GAP = 80;
  const INDENT = 40;

  const columnRow = {
    "%": 0,
    "=": 0,
    "-": 0,
    "%%": 0
  };

  aspects.forEach(a => {

    nodes.push({
      id: a.id,
      label: a.label,
      x: COLUMN_X[a.type],
      y: 120
    });

  });
  graph.nodes.forEach(node => {

    const aspect = node.id.charAt(0) // %, =, -, etc
    const column = COLUMN_X[aspect]

    if (!column) return

    const row = columnRow[aspect]++

    nodes.push({
      ...node,
      x: column,
      y: 220 + row * ROW_GAP
    })

    hierarchyEdges.push({
      from: "aspect_" + aspect,
      to: node.id
    })

  })

  graph.relations.forEach(rel => {

    hierarchyEdges.push({
      from: rel.nodeA.id,
      to: rel.nodeB.id,
      type: rel.type
    })

  })

  return {
    nodes,
    hierarchyEdges
  };

}
// ...