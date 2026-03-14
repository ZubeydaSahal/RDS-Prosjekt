package com.rds.datastructure;

import java.util.*;  // Dårlig praksis, should only import used tools

// TODO: Noder skal kunne opprettes implisitt AA.BB||K1, skal opprette alle noder og relasjoner som ikke eksiterer
//  -> Dette var funksjonen til nodeChecker, må lage ordentlig
//      - Noder opprettes
//      - Alle relasjoner opprettes

public class GraphManager {
    // Attributes
    private Map<String, Node> nodes = new HashMap<>();  // nodes 'id' as key
    private Set<Relation> relations = new HashSet<>();  // Relations

    // Node functions
    public Node createOrUpdateNode(String id, String metadata){
        Node node = nodes.get(id);  // Fetch this node from hashmap

        // Check if node exits
        if (node == null){
            // if not, create and add to 'nodes' hashmap
            node = new Node(id);
            nodes.put(id, node);

            // find parent and create relation  // TEMP - se TODO øverst
            int index = id.lastIndexOf(".");  // find index of last '.' – last node reference

            if (index != -1){  // handles edge case (parent of root doesn't exist)
                String parentId = id.substring(0, index);  // determine parent's id
                Node parent = nodes.get(parentId);

                if(parent == null){  // handles non declared parent – to be replaced check TODO
                    createOrUpdateNode(parentId, null);
                }

                createRelation(id, parentId, "hierarchy");
            }
        }

        node.updateNode(metadata);  // Update varying fields (metadata is JSON or replaced with relevant fields (name..)

        return node;
    }


    public Node getNode(String id){
        /* Fetches node by id (flyttet fra Node.java)*/
        return nodes.get(id);
    }

    public Collection<Node> getNodes(){
        /* Gets all nodes, returns Collection,
        (som er retur verdien fra hashMap's .values())
        */
        return nodes.values();
    }


    // Relation functions
    public Relation createRelation(String idA, String idB, String type){

        // Fetch nodes A and B (both ends of the relations)
        Node nodeA = nodes.get(idA);
        Node nodeB = nodes.get(idB);


        //Check if they don't exist
        // Krav skal kunne implisitt opprette noder, som ikke allerede eksisterer
        //  TODO: Vurderer å flytte denne logikken til en egen funksjon som håndterer alle relasjoner/noder som implisit

       /* if (nodeA == null){
            createOrUpdateNode(idA, null);
            nodeA = nodes.get(idA);  // update nodeA with created node
        }
        if (nodeB == null){
            createOrUpdateNode(idB, null);
            nodeB = nodes.get(idB);  // update nodeB with created node
        }*/

        // midlertidig kaste exeption, håndtere denne logikken senere, se over^^
        if (nodeA == null || nodeB == null) {
            throw new IllegalArgumentException("Failed to create relation, both nodes don't exisrt");
        }

        Relation relation = new Relation(nodeA, nodeB, type);  // TODO: Sikre at relasjonen ikke eksisterer invers

        relations.add(relation);  // Add relation to total list of relations 'relations'

        // Add this relations to each nodes list of own relations
        nodeA.addRelation(relation);
        nodeB.addRelation(relation);

        return relation;
    }

    public Set<Relation> getRelations(){
        return relations;
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

        System.out.println("  ".repeat(depth) + node.getId());

        for (Relation relation : node.getRelations()) {
            if(relation.getType().equals("hierarchy")) {
                Node other = relation.getOtherNode(node);
                if (!visited.contains(other)) {
                    dfs(other, visited, depth + 1);
                }
            }
        }
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
