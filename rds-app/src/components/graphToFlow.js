export function graphToFlow(graph) {

    const flowNodes = graph.nodes.map((node) => ({
        id : node.aspect + ":" + node.id,
        data : {label : node.name},
        position : {x: 0, y: 0}
    }));

    const flowRelations = graph.relations.map((rel, index) => ({
        id : "e" + index,
        source : rel.aspectForNode1 + ":" + rel.idForNode1,
        target : rel.aspectForNode2 + ":" + rel.idForNode2,
        label : rel.nameOfRelation
    }));
    return {flowNodes, flowRelations}
}