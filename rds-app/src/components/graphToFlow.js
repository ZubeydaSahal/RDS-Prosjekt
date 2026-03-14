export function graphToFlow(graph) {

    const flowNodes = graph.nodes.map((node) => ({
        id : node.id,
        data : {label : node.metadata ?? node.code},
        position : {x: 0, y: 0}
    }));

    const flowRelations = graph.relations.map((rel, index) => ({
        id : "e" + index,
        source : rel.nodeA.id,
        target : rel.nodeB.id,
        label : rel.type
    }));
    return {flowNodes, flowRelations}
}