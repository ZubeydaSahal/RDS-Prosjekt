export function layoutTree(graph) {

  if (!graph || !graph.nodes) {
    return { nodes: [], hierarchyEdges: [] };
  }

  const nodes = [];
  const hierarchyEdges = [];

  // ---------- ROOT ----------
  const root = {
    id: graph.root,
    label: graph.root,
    x: 700,
    y: 40
  };

  nodes.push(root);

  // ---------- ASPEKTER ----------
  const aspects = graph.aspects || ["%", "=", "-", "%%"];

  // Endre avstanden mellom kolonnene 
  const COLUMN_X = {};
  const INDENT = 30;
  const ROW_GAP = 50;

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect] = 150 + index * 350;
  });

  // Holder styr på rader per aspekt
  const columnRow = {};
  aspects.forEach(a => columnRow[a] = 0);

  // ---------- ASPEKT-NODER ----------
  aspects.forEach(type => {

    const id = "aspect_" + type;

    nodes.push({
      id,
      label: "aspect " + type,
      x: COLUMN_X[type],
      y: 120
    });

    hierarchyEdges.push({
      from: root.id,
      to: id
    });
  });

  // ---------- NODER ----------
  graph.nodes.forEach(node => {

    const aspect = node.id.charAt(0);

    if (!COLUMN_X[aspect]) return;

    // 🔥 DEPTH (nivå i treet)
    const depth = node.id.split(".").length - 1;

    const row = columnRow[aspect]++;

    const x = COLUMN_X[aspect] + depth * INDENT;
    const y = 200 + row * ROW_GAP;

    nodes.push({
      ...node,
      x,
      y
    });

    // FINN PARENT
    const parts = node.id.split(".");

    if (parts.length === 1) {
      // direkte barn av aspekt
      hierarchyEdges.push({
        from: "aspect_" + aspect,
        to: node.id
      });
    } else {
      const parentId = parts.slice(0, -1).join(".");

      hierarchyEdges.push({
        from: parentId,
        to: node.id
      });
    }

  });

  // ---------- EKSTRA RELASJONER FRA BACKEND ----------
  if (graph.relations) {
    graph.relations.forEach(rel => {
      hierarchyEdges.push({
        from: rel.from,
        to: rel.to
      });
    });
  }

  return {
    nodes,
    hierarchyEdges
  };
}


/* export function layoutTree(graph) {

  // Hvis graf mangler eller ikke inneholder noder, returner tomt resultat
  if (!graph || !graph.nodes) {
    return { nodes: [], hierarchyEdges: [] };
  }

  // Lister som skal returneres til GraphView
  const nodes = [];
  const hierarchyEdges = [];

  // ----------------------------
  // ROOT NODE (toppnode)
  // ----------------------------
  // Dette er hovednoden øverst i visualiseringen
  const root = {
    id: graph.root,
    label: graph.root,
    x: 700,   // horisontal posisjon (midtstilt)
    y: 40     // vertikal posisjon (øverst)
  };

  nodes.push(root);

  // ----------------------------
  // ASPEKTER (kolonner)
  // ----------------------------
  // Rekkefølgen bestemmes av frontend (App.jsx)
  const aspects = graph.aspects || ["%", "=", "-", "%%"];

  // Lager dynamiske x-posisjoner basert på rekkefølge
  const COLUMN_X = {};

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect] = 150 + index * 350;
  });

  // Holder styr på hvor mange noder som er plassert i hver kolonne
  const columnRow = {};
  aspects.forEach(a => columnRow[a] = 0);

  // Avstand mellom noder vertikalt
  const ROW_GAP = 80;

  // ----------------------------
  // ASPEKT-NODER (visuelle overskrifter)
  // ----------------------------
  // Disse er ikke ekte data, kun for layout
  aspects.forEach(type => {

    const id = "aspect_" + type;

    nodes.push({
      id,
      label: "aspect " + type,
      x: COLUMN_X[type], // plasseres i riktig kolonne
      y: 120             // fast høyde under root
    });

    // Kobler root til hver aspekt-kolonne
    hierarchyEdges.push({
      from: root.id,
      to: id
    });

  });

  // ----------------------------
  // NODER FRA BACKEND
  // ----------------------------
  // Plasserer hver node i riktig kolonne basert på aspekt
  graph.nodes.forEach(node => {

    // Første tegn i id bestemmer aspekt (% = - osv)
    const aspect = node.id.charAt(0);

    // Hvis aspekt ikke finnes i layouten, hopp over
    if (!COLUMN_X[aspect]) return;

    // Finn neste ledige rad i kolonnen
    const row = columnRow[aspect]++;

    nodes.push({
      ...node,
      x: COLUMN_X[aspect],           // kolonneposisjon
      y: 200 + row * ROW_GAP         // vertikal plassering
    });

    // Kobler aspekt til node
    hierarchyEdges.push({
      from: "aspect_" + aspect,
      to: node.id
    });

  });

  // ----------------------------
  // RELASJONER FRA BACKEND
  // ----------------------------
  // Tegner forbindelser mellom noder
  // OBS: Dette kan påvirke layout visuelt
  graph.relations.forEach(rel => {
    hierarchyEdges.push({
      from: rel.from,
      to: rel.to
    });
  });

  // ----------------------------
  // RETURNER RESULTAT
  // ----------------------------
  return {
    nodes,
    hierarchyEdges
  };
} */





