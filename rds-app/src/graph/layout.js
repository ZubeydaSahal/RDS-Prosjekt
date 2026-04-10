export function layoutTree(graph) {

  // Edge case handling
  console.log("grpah : " + graph)
  if (!graph || !graph.nodes) {
    console.log("Ugyldig graph");
    return {nodes: [], hierarchyEdges: []};
  }
  console.log("Graph input:", graph); // Logging


  // Variable declaration
  const COL_GAP = 250; // distance between colukmns
  const ROW_GAP = 70; // Distance between rows
  const INDENT = 40 // Distence dented in per level

  let x = 0; // Horizontal counter (incraeses for each aspect)

  const positionedNodes = []; // var to hold all positioned nodes


  // ====== Parse and format nodeDTO ======
  Object.entries(graph.nodeDTO).forEach(([aspect, list]) => {
    let y = 0; // Vertical counter

    // ==== Create aspect header element ======
    positionedNodes.push({
      id: 'header-' + aspect,
      name: aspect,
      level: 1,
      x: x, //X Position?
      y: y, // Y- position?
    });
    console.log("Positioned nodes: "+positionedNodes);

    y += ROW_GAP;  // space for elemetn below

    // Nodes from list (under header)
    list.forEach((node) => {
      positionedNodes.push({
        ...node,
        x: x + node.level * INDENT,
        y: y
      })
      y += ROW_GAP; // vertical spacing
    });
    x += COL_GAP // Spacing for next column of nodes (aspect)
  })
  console.log("Positioned nodes: "+positionedNodes);
  return positionedNodes;
}
