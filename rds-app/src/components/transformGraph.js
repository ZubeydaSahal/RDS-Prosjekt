// ----------------------------
// TRANSFORM BACKEND → FRONTEND FORMAT
// ----------------------------
export function transformGraph(raw) {

    if (!raw || !raw.nodeDTO) {
      console.log("Ugyldig graph input");
      return null;
    }
  
    const nodes = [];
    const aspects = [];
    var root = {
        id: "ROOT-TEMP",
        name: "ROOT-TEMP"
    };

  
    // ----------------------------
    // Process nodeDTO – Liste med par av aspekt og nodelster, ** inkludert root **
    // ----------------------------
    Object.entries(raw.nodeDTO).forEach(([aspectKey, list], index) => {

        // Create list of aspects
        aspects.push({
            id: aspectKey,
            label: aspectKey,
            order: index
        });

        if (!Array.isArray(list)) return; // Avoid edge case, check that list is indeed an array


        //process each node in list
        list.forEach(item => {
            // Extract root
            try {
                if (item.level == 0) {
                    console.log("Root sset to: "+item.id)
                    root = {
                        id: item.id,
                        name: item.name
                    };
                }
            }
            catch (err){
                console.log("++SEAN++ 'transformGraph' klarte ikke å finne item.level == 0 \n" + err)
            }

            nodes.push({
                id: item.id,
                name: item.name,
                aspect: aspectKey // kunne heller sendt fra backend
            });
        });
    });
  
    // ----------------------------
    // RELATIONS
    // ----------------------------
    // Convert each relation and put in list 'relations'
    const relations = (raw.relationDTO || []).map(r=> ({
        from : r.node1,
        to: r.node2,
        r: r.type || "cross" // Catch hvis JS ikke tåler nullverdier
    }));

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