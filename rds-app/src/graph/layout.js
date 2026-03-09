export function layoutTree(root) {

  if (!root) return { nodes: [], hierarchyEdges: [] };

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

  nodes.push({
    ...root,
    x: 600,
    y: 40
  });

  aspects.forEach(a => {

    nodes.push({
      id: a.id,
      label: a.label,
      x: COLUMN_X[a.type],
      y: 120
    });

    hierarchyEdges.push({
      from: root.id,
      to: a.id
    });

  });

  function place(node, parent, depth, column) {

    const row = columnRow[column]++;
    const x = COLUMN_X[column] + depth * INDENT;
    const y = 200 + row * ROW_GAP;

    nodes.push({
      ...node,
      x,
      y
    });

    hierarchyEdges.push({
      from: parent.id,
      to: node.id
    });

    if (node.children) {
      node.children.forEach(child =>
        place(child, node, depth + 1, column)
      );
    }

  }

  if (root.children) {

    root.children.forEach(child => {

      const col = child.relationType;

      place(child, { id: "aspect_" + col }, 0, col);

    });

  }

  return {
    nodes,
    hierarchyEdges
  };

}