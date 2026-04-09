// ----------------------------
// TRANSFORM BACKEND → FRONTEND FORMAT
// ----------------------------
export function transformGraph(raw) {

    if (!raw || !raw.aspects) {
      console.log("Ugyldig graph input");
      return null;
    }
  
    const nodes = [];
    const aspects = [];
  
    // ----------------------------
    // ROOT
    // ----------------------------
    const root = {
      id: "ROOT",
      label: "System"
    };
  
    // ----------------------------
    // ASPEKTER + NODER
    // ----------------------------
    Object.entries(raw.aspects).forEach(([aspectKey, list], index) => {
  
      aspects.push({
        id: aspectKey,
        label: aspectKey,
        order: index
      });
  
      if (!Array.isArray(list)) return;
  
      list.forEach(item => {
  
        nodes.push({
            id: item.id,
            name: item.name,
            aspect: aspectKey
          });
      });
    });
  
    // ----------------------------
    // RELATIONS
    // ----------------------------
    const relations = (raw.relations || []).map(r => {
  
      const from = normalizeId(r.from, raw.aspects);
      const to = normalizeId(r.to, raw.aspects);
  
      return {
        from,
        to,
        type: r.type || "cross"
      };
    });
  
    return {
      root,
      nodes,
      aspects,
      relations
    };
  }
  
  
  // ----------------------------
  // HJELPEFUNKSJON
  // ----------------------------
  function normalizeId(id, aspects) {
  
    if (!id) return id;
  
    if (id.startsWith("%") || id.startsWith("=") || id.startsWith("-") || id.startsWith("%%")) {
      return id;
    }
  
    for (const key in aspects) {
      const list = aspects[key];
  
      if (Array.isArray(list) && list.some(n => n.id === id)) {
        return key + id;
      }
    }
  
    return id;
  }