import {getAspectLabels, getAspectSymbols} from "../../../config/aspects.ts";

export function layoutTree(graph, aspectOrder) {

  if (!graph || !graph.nodes || !graph.root) {
    console.log("Ugyldig graph");
    return { nodes: [], hierarchyEdges: [] };
  }

  const collapsedNodes = graph.collapsedNodes || new Set();
  const maxDepth = graph.maxDepth ?? null;
  const nodes = [];

  const backendEdges = (graph.relations || []).filter(
    e => e.type !== "hierarchy"
  );




  // ----------------------------
  // ASPEKTER
  // ----------------------------
  let aspects;
  if (aspectOrder) {
    console.log(" (Layout.js) ASpect order: "+aspectOrder)
    aspects = aspectOrder
        //console.log(graph.aspects)
      .map(id => graph.aspects.find(a => a.id === id))
      .filter(Boolean);
  } else {
    aspects = [...graph.aspects].sort((a, b) => a.order - b.order);
  }

  const COLUMN_X = {};
  let colSpacing = 350;

  // ----------------------------
  // NODE MAP – Sean moved up, to check node depth before spacing columns
  // ----------------------------
  let greatestDepth = 0;
  let incrColBy = 20;

  const nodeMap = {};
  graph.nodes.forEach(n => {
    // Find deepest node
    if(n.depth > greatestDepth) {
      greatestDepth = n.depth;  // replace 'greatestDepth'
    }


    console.log("Layout: L77 foreach – node: ", n)
    console.log(n)
    nodeMap[n.id] = { ...n, children: [] };
  });

  // =====  Column spacing incrementing ====
  // Increase spacing between columns if node depth is greater than 5
  if (greatestDepth > 1) {
    if(greatestDepth > 50){
      incrColBy = 30;
    }
      if (greatestDepth > 100) {
        incrColBy = 40;  // increase spacing between columns with 40 for each depth}
    }
    // indent = 40 per child/generation 5*40 = 200 -> increament by 200 for each time to keep gap large enough
    console.log("<><><> A node has more than level 5 depth <><><> \n'greatestDepth': " + greatestDepth)
    //colSpacing = colSpacing + 200 * Math.floor(greatestDepth / 5)  // increase spacing between columns with 1.5 *
    colSpacing = colSpacing + incrColBy * greatestDepth  // increase spacing between columns with 40 for each depth
    console.log("colSpacing * 40 * "+ greatestDepth)

  }


  // ----------------------------
  // ROOT
  // ----------------------------
  nodes.push({
    ...graph.root,
    //x: 350 * 1.5 + (incrColBy * greatestDepth * 1.5),
    x: 50 +(colSpacing * (aspects.length-1)/2),
    y: 40,
    type: "root"
  });
  //alert(incrColBy * greatestDepth)

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect.id] = 50 + index * colSpacing;
  });

  // ----------------------------
  //  NAVN PÅ ASPEKTER
  // ----------------------------
  const ASPECT_NAMES = getAspectLabels;
  /*Erstattet av config
      {
    "%": "Type aspect",
    "=": "Function aspect",
    "-": "Product aspect",
    "%%": "Type aspect (product)"
  };*/


  // ----------------------------
  // ASPEKT HEADERS
  // ----------------------------
  console.log("Aspects before ASPECT HEADERS: ", aspects)
  console.log("'colSpacing' jsut before ASPECT HEADERS: "+ colSpacing)
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
  // LAYOUT MED COLLASPE NODE
  // ----------------------------
  const ROW_GAP = 35;
  const INDENT = 40;
  const visibleHierarchyEdges = [];

  aspects.forEach((aspect) => {

    let currentY = 180;

    function dfs(node, depth) {

      const name = node.name || node.label || "";

      const label = node.id
        ? node.description
          ? `${node.aspect} ${node.code} ${name} (${node.description})`
          : `${node.aspect} ${node.code} ${name}`
        : "";

        const isCollapsed = collapsedNodes.has(node.id);

      nodes.push({
        ...node,
        label,
        x: COLUMN_X[aspect.id] + depth * 20,
        y: currentY,
        children: node.children,
        collapsed:isCollapsed
      });

      currentY += ROW_GAP;

        const depthLimited = maxDepth !== null && depth >= maxDepth - 1;
        if (!isCollapsed && !depthLimited) {
        node.children.forEach(child => {
          visibleHierarchyEdges.push({ from: node.id, to: child.id, type: "hierarchy" });
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
      ...generatedHierarchyEdges,
      ...backendEdges
    ]
  };
}