export function layoutTree(graph) {

  // Hvis graf mangler eller ikke inneholder noder, returner tomt resultat
  if (!graph || !graph.nodes) {
    console.log("Ingen graph eller nodes");
    return { nodes: [], hierarchyEdges: [] };
  }

  console.log("Graph input:", graph);

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

  console.log("Aspects:", aspects);

  // Lager dynamiske x-posisjoner basert på rekkefølge
  const COLUMN_X = {};

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect] = 150 + index * 350;
  });

  console.log("COLUMN_X:", COLUMN_X);

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

    console.log("Processing node:", node);

    // Første tegn i id bestemmer aspekt (% = - osv)
    const aspect = node.id?.charAt(0);

    console.log("Aspect:", aspect);

    // Hvis aspekt ikke finnes i layouten, hopp over
    if (COLUMN_X[aspect] === undefined) {
      console.log("Hopper over node:", node.id);
      return;
    }

    // Finn neste ledige rad i kolonnen
    const row = columnRow[aspect]++;

    // Bygger label basert på tilgjengelige felt
    const name = node.name || node.label || "";

    const label = node.id
      ? node.description
        ? `${node.id} ${name} (${node.description})`
        : `${node.id} ${name}`
      : "";

    console.log("Label:", label);

    nodes.push({
      ...node,
      label,
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
  (graph.relations || []).forEach(rel => {
    console.log("Relation:", rel);

    hierarchyEdges.push({
      from: rel.from,
      to: rel.to
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