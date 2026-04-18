// ----------------------------
// TRANSFORM BACKEND → FRONTEND FORMAT
// ----------------------------
export function transformGraph(raw) {

    // Backend sender: { nodeDTO: {...}, relationDTO: [...] }
    if (!raw || !raw.nodeDTO) {
        console.log("Ugyldig graph input:", raw);
        return null;
    }

    console.log("HELE GRAPH FRA BACKEND:", raw);

    const nodes = [];
    const aspects = [];

    // ----------------------------
    // ROOT — hent fra nodeDTO["<root>"]
    // ----------------------------
    const rootList = raw.nodeDTO["<root>"] || [];
    const rootNode = rootList[0];

    const root = {
        id: rootNode ? rootNode.id : "ROOT",
        label: rootNode ? rootNode.id : "System",
        type: "root"
    };

    // ----------------------------
    // ASPEKTER + NODER — hopp over <root>
    // ----------------------------
    Object.entries(raw.nodeDTO).forEach(([aspectKey, list], index) => {

        // Ikke inkluder <root> som aspekt
        if (aspectKey === "<root>") return;

        aspects.push({
            id: aspectKey,
            label: aspectKey,
            order: index
        });
        console.log("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")

        if (!Array.isArray(list)) return;

        list.forEach(item => {
            nodes.push({
                ...item
            });
            console.log("TransformGraph: L49 foreach node – node: ", item)
        });
        console.log("TransformGraph: L51 after foreach node – nodes[]: ", nodes)
    });

    // ----------------------------
    // RELATIONS — bruker node1/node2 fra RelationDTO
    // ----------------------------
    const relationArray = Array.isArray(raw.relationDTO)
        ? raw.relationDTO
        : Array.from(raw.relationDTO || []);

    const relations = relationArray.map(r => ({
        from: r.node1,
        to: r.node2,
        type: r.type || null
    }));

    return {
        root,
        nodes,
        aspects,
        relations
    };
}