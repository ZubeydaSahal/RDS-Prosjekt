export function layoutTree(graph) {

  if (!graph.root || !graph.nodes) {
    console.log("Ugyldig backend-data");
    return { nodes: [], hierarchyEdges: [] };
  }

  if (!graph.aspects) {
    console.log("Backend mangler aspects");
    return { nodes: [], hierarchyEdges: [] };
  }

  // Hvis graf mangler eller ikke inneholder noder, returner tomt resultat
  if (!graph || !graph.nodes) {
    console.log("Ingen graph eller nodes");
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
  // Dette er hovednoden øverst i visualiseringen
  nodes.push({
    ...graph.root,
    x: 700,
    y: 40,
    type: "root"
  });


  // ----------------------------
  // ASPEKTER (kolonner)
  // ----------------------------
  // Hvis frontend har sendt rekkefølge → bruk den
  // Hvis ikke → bruk backend sin standard (order)
  let aspects;

  if (graph.aspectOrder && graph.aspectOrder.length) {

    aspects = graph.aspectOrder
      .map(id => graph.aspects.find(a => a.id === id))
      .filter(Boolean); // fjerner undefined hvis noe mangler

  } else {

    aspects = [...graph.aspects]
      .sort((a, b) => a.order - b.order);

  }

  console.log("Aspects:", aspects);


  // Lager dynamiske x-posisjoner basert på rekkefølge
  const COLUMN_X = {};

  aspects.forEach((aspect, index) => {
    COLUMN_X[aspect.id] = 150 + index * 350;
  });

  console.log("COLUMN_X:", COLUMN_X);


  // Holder styr på hvor mange noder som er plassert i hver kolonne
  const columnRow = {};
  aspects.forEach(a => columnRow[a.id] = 0);


  // Avstand mellom noder vertikalt
  const ROW_GAP = 80;


  // ----------------------------
  // ASPEKT-NODER (visuelle overskrifter)
  // ----------------------------
  // Bruker aspects (ikke graph.aspects)
  // slik at rekkefølgen følger frontend
  aspects.forEach((aspect) => {

    const id = "aspect_" + aspect.id;

    nodes.push({
      id,
      label: aspect.label,
      x: COLUMN_X[aspect.id],
      y: 120,
      type: "aspect"
    });

  });


  // ----------------------------
  // NODER FRA BACKEND
  // ----------------------------
  graph.nodes.forEach(node => {

    console.log("Processing node:", node);

    // Bruker aspekt fra backend
    const aspect = node.aspect;

    console.log("Aspect:", aspect);

    // Hvis aspekt ikke finnes i layouten, hopp over
    if (COLUMN_X[aspect] === undefined) {
      console.log("Hopper over node:", node.id);
      return;
    }

    // Finn neste ledige rad i kolonnen
    const row = columnRow[aspect]++;

    // Bygger label
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
      x: COLUMN_X[aspect],
      y: 200 + row * ROW_GAP
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