package com.rds.datastructure;

// ===== Libraries =====

import org.springframework.web.bind.MissingRequestValueException;

import java.rmi.UnexpectedException;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;


public class GraphManager {
    // ===== Attributes =====
    private Map<String, Node> nodes = new HashMap<>();  // nodes 'id' as key
    private Set<Relation> crossRelations = new HashSet<>();  // Relations
    private Node root = null;

    // ===== Logger – if errors in creating datastructure =====
    private static final Logger LOGGER = Logger.getLogger(GraphManager.class.getName());

    // ===== Setter =====
    public void setRoot(String id) {
        this.root = createOrUpdateNode(id, "<root>", null);
        root.setLevel(0);
        System.out.println("\t<Graphmanager> Setting root.. id: " + id);
    }

    // ===== Getter =====
    public Map<String, Node> getNodeList() {
        return nodes;
    }

    public Set<Relation> getCrossRelations() {
        return crossRelations;
    }

    // ===== Handle 'node' =====
    public Node createOrUpdateNode(String id, String aspect, String metadata) {
        Node node = nodes.get(id);  // Fetch input node from hashmap

        // Check if node already exits
        if (node == null) {

            // ––––– if not, create and add to 'nodes' hashmap –––––
            System.out.print("\t<Node> creating node: " + id+"\n");

            if (aspect != null) {  // Check that aspect has a value
                node = new Node(id, aspect);
            } else {  // Else crete a placeholder and log
                node = new Node(id);
                LOGGER.warning("<GraphManager> Missing aspect for node id: " + id + ". Using aspectless constructor");
            }

            // Don't add root to nodelist or break into peaces
            if(aspect == "<root>"){
                nodes.put(id, node);  // TEMP
                return node;
            }

            nodes.put(id, node);  // Add node to attribute 'nodes' (HashMap)
            System.out.println("Just addded node: id="+id + ", nodes");

            // ––––– find parent and create relation –––––
            int index = id.lastIndexOf(".");  // find index of last '.' – last node reference

            if (index != -1) {  // avoid edge case (parent of root doesn't exist)

                String parentId = id.substring(0, index);  // determine parent's id
                Node parent = nodes.get(parentId);  // Try to fetch parent from 'nodes'

                // ––––– If parent doesn't exist, create parent–––––
                if (parent == null) {  // handles non declared parent
                    System.out.print("\t Parent = null");
                    createOrUpdateNode(parentId, node.getAspect(), null);  // parents and children share aspect
                }

                // ––––– Create relation to parent, with type: "hierarchy" –––––
                System.out.println("\t\t<GraphManager> Creating parent relation.. '"+ parentId+"' –– '"+id+"'");
                createRelation(parentId, aspect, id, aspect, "hierarchy");  // parents and children share aspect
                // nodeA = parent, nodeB = child -> Relation (nodeA, nodeA_aspect, nodeB, nodeB_aspect)
            }
        }
        // ––––– Update node ––––– // Currently only for name
        if(metadata!=null){
            node.updateNode(metadata);  // Update varying fields (metadata is JSON or replaced with relevant fields (name..)
        }
        return node;
    }

    // ===== Handle 'relation' =====
    public void createRelation(String idA, String aspectA, String idB, String aspectB, String type) {

        // Fetch nodes A and B (both ends of the relations)
        Node nodeA = nodes.get(idA);
        Node nodeB = nodes.get(idB);


        //Check if they don't exist –> create them (recursively handles parents)
        if (nodeA == null) {
            System.out.print("\t");
            nodeA = createOrUpdateNode(idA, aspectA, null);  // update nodeA with new created node
        }
        if (nodeB == null) {
            System.out.print("\t");
            nodeB = createOrUpdateNode(idB, aspectB, null);  // update nodeB with new created node
        }

        // ––––– Create relation –––––

        Relation relation = new Relation(nodeA, nodeB, type);  


        // ––––– Store relations –––––

        // ––– If it's a cross relation –––
        if (type != null && !type.equals("hierarchy")) {  // if defined relation type isn't 'hierarchy'
            crossRelations.add(relation);  // add to GraphManagers 'crossRelations'
            System.out.println("\t\t<Relation> creating cross relation: "+ nodeA.getId()+" – "+ nodeB.getId());
        }
        if (type == null) { //if no relation type is defined
            crossRelations.add(relation);  // add to GraphManagers 'crossRelations'
            System.out.println("\t\t<Relation> creating cross relation: "+ nodeA.getId()+" – "+ nodeB.getId());
        }

        // ––– If it's a hierarchy relation –––
        if (type != null && type.equals("hierarchy")) {
            // add to each node's list of relations
            nodeA.addRelation(relation);
            nodeB.addRelation(relation);
        }
    }



    // ===== Connect root to aspects =====
    public void finalizeGraph() {
        /* Connects root to top level nodes (roots children) – aren't automatically connected, since root is
         * not referenced in nodes' IDs – level 1 nodes
         * Must be called one time after parsing is complete
         * */

        // Check if root exits
        if (root == null) {
            throw new NullPointerException("Root is not defined, root = null");
        }

        // ––––– find top level nodes –––––
        for (Node node : nodes.values()) {
            // For each node in 'nodes' map (unordered list), check for level 1 nodes (No parents)
            if (node.getLevel() == 1) {
                boolean connnectedToRoot = false;

                // Check if node is connected to root (suspect redundant, but might as well be safe)
                for (Relation relation : node.getHierarchyRelations()) {
                    // get all its relations and check if the other node is root
                    if (relation.getOtherNode(node) == root) {
                        connnectedToRoot = true;  // if root is related, break and go to next node
                        break;
                    }
                }
                if (connnectedToRoot) {
                    continue;
                }  // go to next node

                // Create relation to root, if they aren't already connected
                createRelation(root.getId(), root.getAspect(), node.getId(), node.getAspect(), "hierarchy");  // Connect to root

            }
        }
    }

    
    
    public Set<Relation> getFilteredCrossRelations(Map<String, Boolean> filters) {
        if (filters == null) return crossRelations;

        // Hvis rel_cross er false → returner tom liste
        Boolean showCross = filters.get("cross");
        if (showCross != null && !showCross) {
            return new HashSet<>();
        }

        // Filtrer på spesifikke relasjonstyper (A, B osv.)
        return crossRelations.stream()
            .filter(r -> {
                String type = r.getType();
                Boolean show = filters.get(type);
                return show == null || show; // vis hvis ikke eksplisitt skrudd av
            })
            .collect(Collectors.toSet());
    }

    // filter for aspect
    public Map<String, Node> getFilteredNodesByAspect(Map<String, Boolean> filters) {
        if (filters == null) {
            return nodes;
        }

        return nodes.entrySet().stream()
                .filter(entry -> {
                    Node node = entry.getValue();

                    String aspect = node.getAspect();
                    Boolean show = filters.get(aspect);


                    if (show == null) {
                        System.out.println("(GM) Show == null -> True , aspect: "+aspect+", node: "+node.getId());
                        return true;
                    }

                    return show;
                })
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue
                ));
    }

    /* // May be removed, if hierarchy edges and traversal won't be used
    // DFS
    public void printGraph() {
        Set<Node> visited = new HashSet<>();

        for (Node node : nodes.values()) {
            if (!visited.contains(node)) {
                dfs(node, visited, 0);
            }
        }
    }


    private void dfs(Node node, Set<Node> visited, int depth) {
        visited.add(node);

        System.out.println("  ".repeat(depth) + node.getAspect() + node.getId());

        for (Relation relation : node.getHierarchyRelations()) {
            if (!relation.getType().isEmpty() && relation.getType().equals("hierarchy")) {
                Node other = relation.getOtherNode(node);
                if (!visited.contains(other)) {
                    dfs(other, visited, depth + 1);
                }
            }
        }
    }
    */

}
