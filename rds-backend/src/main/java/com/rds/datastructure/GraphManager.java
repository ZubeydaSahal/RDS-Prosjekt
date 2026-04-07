package com.rds.datastructure;

import java.util.*;  // Dårlig praksis, should only import used tools
import java.util.stream.Collectors;

// TODO: Noder skal kunne opprettes implisitt AA.BB||K1, skal opprette alle noder og relasjoner som ikke eksiterer
//  -> Dette var funksjonen til nodeChecker, må lage ordentlig
//      - Noder opprettes
//      - Alle relasjoner opprettes

public class GraphManager {
    // Attributes
    private Map<String, Node> nodes = new HashMap<>();  // nodes 'id' as key
    private Set<Relation> crossRelations = new HashSet<>();  // Relations
    private Node root = null;


    public void setRoot(String id) {
        this.root = createOrUpdateNode(id, "<root>", null);
        root.setLevel(0);
        System.out.println("<Root> Setting root.. id: " + id);
    }

    // Node functions
    public Node createOrUpdateNode(String id, String aspect, String metadata) {
        Node node = nodes.get(id);  // Fetch this node from hashmap

        // Check if node exits
        if (node == null) {
            // if not, create and add to 'nodes' hashmap
            System.out.println("<+Node+> creating new node: " + id);

            if(aspect != null){
                node = new Node(id, aspect);
            }
            else{
                node = new Node(id);
            }

            nodes.put(id, node);

            // find parent and create relation  // TEMP - se TODO øverst
            int index = id.lastIndexOf(".");  // find index of last '.' – last node reference

            if (index != -1) {  // handles edge case (parent of root doesn't exist)
                String parentId = id.substring(0, index);  // determine parent's id
                Node parent = nodes.get(parentId);
                //System.out.println("Parent/root dont exist, this is parentID: " + parentId);

                if (parent == null) {  // handles non declared parent – to be replaced check TODO
                    createOrUpdateNode(parentId, node.getAspect(), null);  // parents and children share aspect
                    System.out.println("<-Node-> Parent doesn't exist, creating parent: " + parentId);
                }

                createRelation(parentId, aspect, id, aspect, "hierarchy");  // parents and children share aspect
                // Relation (nodeA, nodeA_aspect, nodeB, nodeB_aspect) –> nodeA = parent, nodeB = child
                System.out.println("<Relation> create relation: " + id + " and parent " + parentId);
            }
        }

        node.updateNode(metadata);  // Update varying fields (metadata is JSON or replaced with relevant fields (name..)

        return node;
    }

    public Node getNode(String id) {
        /* Fetches node by id (flyttet fra Node.java)*/
        return nodes.get(id);
    }

    public Collection<Node> getNodes() {
        /* Gets all nodes, returns Collection,
        (som er retur verdien fra hashMap's .values())
        */
        return nodes.values();
    }

    public Map<String, Node> getNodeList(){
        return nodes;
    }


    // Relation functions
    public Relation createRelation(String idA, String aspectA, String idB, String aspectB, String type) {

        // Fetch nodes A and B (both ends of the relations)
        Node nodeA = nodes.get(idA);
        Node nodeB = nodes.get(idB);


        //Check if they don't exist
        // Krav skal kunne implisitt opprette noder, som ikke allerede eksisterer
        //  TODO: Vurderer å flytte denne logikken til en egen funksjon som håndterer alle relasjoner/noder som implisit
        // Konrad: midlertidig tatt bort kommentaren med de to første if-testene.

        if (nodeA == null) {
            createOrUpdateNode(idA, aspectA, null);
            nodeA = nodes.get(idA);  // update nodeA with created node
            System.out.println("created node A");
        }
        if (nodeB == null) {
            createOrUpdateNode(idB, aspectB, null);
            nodeB = nodes.get(idB);  // update nodeB with created node
            System.out.println("created node B");
        }

        // midlertidig kaste exeption, håndtere denne logikken senere, se over^^
        /*
        if (nodeA == null || nodeB == null) {
            throw new IllegalArgumentException("Failed to create relation, both nodes don't exisrt");
        }
         */


        Relation relation = new Relation(nodeA, nodeB, type);  // TODO: Sikre at relasjonen ikke eksisterer invers

        if (!type.equals("hierarchy")) {
            crossRelations.add(relation);  // Add relation to total list of cross relations 'cross_relations'
        }

        // Add this relations to each nodes list of own relations
        if (type.equals("hierarchy")) {
            nodeA.addRelation(relation);
            nodeB.addRelation(relation);
        }

        return relation;
    }

    public Set<Relation> getCrossRelations() {
        return crossRelations;
    }

    public void finalizeGraph() {
        /* Connects root to top level nodes (roots children) – aren't automatically connected, since root is
         * not referenced in nodes' IDs – level 1 nodes
         * Must be called one time after parsing is complete
         * */
        if (root == null) {
            throw new NullPointerException("Root is not defined, root = null");
        }

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

                // Handle top level nodes, which aren't connected to root
                createRelation(root.getId(), root.getAspect(), node.getId(), node.getAspect(),  "hierarchy");  // Connect to root

            }
        }
    }


    // TEMP DFS  - kan være den roter seg bort i kryssrelasjoner
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
            if (relation.getType().equals("hierarchy")) {
                Node other = relation.getOtherNode(node);
                if (!visited.contains(other)) {
                    dfs(other, visited, depth + 1);
                }
            }
        }
    }

    public Set<Relation> getFilteredRelations(Map<String, Boolean> filters) {
    if (filters == null) {
        return crossRelations;
    }
    return crossRelations.stream()
        .filter(r -> {
            String type = r.getType() == null ? "" : r.getType();
            Boolean show = filters.get(type);

            // hvis ikke spesifisert → vis
            if (show == null) {
                return true;
            }

            return show;
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
                return true;
            }

            return show;
        })
        .collect(Collectors.toMap(
            Map.Entry::getKey,
            Map.Entry::getValue
        ));
}



/*
    public void nodeChecker(String id, String code, String aspect){
        //NodeChecker(id, name, aspect);  - mener konrad name = sporveksel eller AA

        // Check all existing nodes by aspect
        for (Node node : nodes.getNodesByAspect(aspect)){
            if(id == node.getId()){
                System.out.println("Node exists: " + id);
            }
            else{
                createNode(id, code, aspect);
            }
        }


    }


    public void createNode(String id, String code, String aspect){
        // Anta nivå kommer som input?
        Node node = new Node(id, code);  // create node
        nodes.addNode(node, aspect);  // add node to registry 'nodes'

    }

    public void createRelation(String firstNode, String secondNode, String type){
        // RelationChecker(leftNode, rightNode, "type")
        // TODO: sikre at type kan være None
        //Node firstNode = nodes.getNodesById()

    }

*/
}  // GrappManager ferdig
