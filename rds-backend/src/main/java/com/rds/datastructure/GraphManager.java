package com.rds.datastructure;

import java.util.*;  // Dårlig praksis, should only import used tools

public class GraphManager {
    // Attributes
    private Map<String, Node> nodes = new HashMap<>();  // nodes 'id' as key
    private Set<Relation> relations = new HashSet<>();  // Relations


    public Node createOrUpdateNode(String id, String code, int level, String metadata){
        Node node = nodes.get(id);  // Fetch this node from

        return node;
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
}
