/* 
Standardiserer data fra backend
Konverterer:
relations → edges
metadata → label
*/
export function normalizeGraph(graph) {
    return {
      nodes: graph.nodes.map(n => ({
        id: n.id,
        label: n.metadata ?? n.code ?? n.id
      })),
      edges: graph.relations.map(r => ({
        from: r.nodeA.id,
        to: r.nodeB.id,
        type: r.type
      }))
    }
  }