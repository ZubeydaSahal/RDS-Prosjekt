package com.rds.datastructure;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;

public class GraphManager {

    private Map<String, Node> nodes = new LinkedHashMap<>();
    private Set<Relation> relations = new HashSet<>();

    public Node createOrUpdateNode(String id, String metadata) {
        Node node = nodes.get(id);

        if (node == null) {
            node = new Node(id);
            nodes.put(id, node);

            // Lag foreldre automatisk
            int index = id.lastIndexOf(".");
            if (index != -1) {
                String parentId = id.substring(0, index);
                if (nodes.get(parentId) == null) {
                    createOrUpdateNode(parentId, null);
                }
                Node parentNode = nodes.get(parentId);
                relations.add(new Relation(parentNode, node, "hierarchy"));
            }
        }

        node.updateNode(metadata);
        return node;
    }

    public Node getNodeById(String id) {
        return nodes.get(id);
    }

    public Map<String, Node> getAllNodes() {
        return nodes;
    }

    public List<Node> getNodesByAspect(String aspect) {
        List<Node> resultat = new ArrayList<>();
        for (Node node : nodes.values()) {
            if (node.getId().startsWith(aspect)) {
                resultat.add(node);
            }
        }
        return resultat;
    }

    public void addRelation(String idA, String idB, String type) {
        Node nodeA = createOrUpdateNode(idA, null);
        Node nodeB = createOrUpdateNode(idB, null);
        relations.add(new Relation(nodeA, nodeB, type));
    }

    public Set<Relation> getRelations() {
        return relations;
    }
}