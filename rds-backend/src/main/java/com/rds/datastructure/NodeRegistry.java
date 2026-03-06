package main.java.com.rds.datastructure;

import java.util.*;

public class GraphManager {

    private final Map<String, Node> nodesById = new HashMap<>();
    private final Set<Relation> relations = new HashSet<>();

    // ======================================================
    // NODE HANDLING
    // ======================================================

    public Node createOrUpdateNode(String id, String code, Integer level, String metadata) {

        Node node = nodesById.get(id);

        if (node == null) {
            node = new Node(id);
            nodesById.put(id, node);
        }

        node.update(code, level, metadata);

        return node;
    }

    public Node getNode(String id) {
        return nodesById.get(id);
    }

    public Collection<Node> getAllNodes() {
        return nodesById.values();
    }

    // ======================================================
    // RELATION HANDLING (Undirected)
    // ======================================================

    public Relation createRelation(String idA, String idB, String type) {

        Node nodeA = nodesById.get(idA);
        Node nodeB = nodesById.get(idB);

        if (nodeA == null || nodeB == null) {
            throw new IllegalArgumentException("Both nodes must exist before creating relation.");
        }

        Relation relation = new Relation(nodeA, nodeB, type);

        relations.add(relation);

        nodeA.addRelation(relation);
        nodeB.addRelation(relation);

        return relation;
    }

    public Set<Relation> getAllRelations() {
        return relations;
    }

    // ======================================================
    // OPTIONAL: Basic Traversal (DFS)
    // ======================================================

    public void printGraph() {
        Set<Node> visited = new HashSet<>();

        for (Node node : nodesById.values()) {
            if (!visited.contains(node)) {
                dfs(node, visited, 0);
            }
        }
    }

    private void dfs(Node node, Set<Node> visited, int depth) {
        visited.add(node);

        System.out.println("  ".repeat(depth) + node.getId());

        for (Relation relation : node.getRelations()) {
            Node other = relation.getOther(node);
            if (!visited.contains(other)) {
                dfs(other, visited, depth + 1);
            }
        }
    }
}


/*package main.java.com.rds.datastructure;
import java.awt.geom.NoninvertibleTransformException;
import java.util.*;

public class NodeRegistry {
    private Map<String, List<Node>> nodes = new HashMap<>();  // list of nodes indexed on aspect
    private List<String> aspects = new ArrayList();  // list of aspects
    // Hardkode aspekter istedenfor String?

    public Map<String, List<Node>> getNodes() {
        return nodes;
    }

    public List<Node> getNodesByAspect(String aspect){

        // Add aspect to list if not initialized - kan fjernes om aspekter hardkodes
        if (!aspects.contains(aspect)){
            System.out.println("Aspect: " + aspect + " does not exist");  //TODO: improve error handling/logging
            return null;
            }

        return nodes.get(aspect);  // returns all sub-nodes of the aspect
    }

    public void addNode(Node node, String aspect) {
        // kansje lage en aspect klasse

        // add apsect to list if it doesn't exist
        if(!nodes.containsKey(aspect)){
            nodes.put(aspect, new ArrayList<>());
        }
        // Add node with aspect as key, to registry
        nodes.get(aspect).add(node);
    }


    public void addAspects(String aspect) {
        this.aspects.add(aspect);  // add aspect to list
        nodes.put(aspect, new ArrayList<>());  // initiate empty list for this aspect
    }
}
*/