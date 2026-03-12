package com.rds.datastructure;

public class Relation {
    // Connected nodes
    private final Node nodeA;
    private final Node nodeB;
    private final String type;  // Relation type (PS, None, etc)



    // Constructor
    public Relation(Node nodeA, Node nodeB, String type) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.type = type;
    }

    // Getters
    public Node getNodeA() {
        return nodeA;
    }

    public Node getNodeB() {
        return nodeB;
    }

    public String getType() {
        return type;
    }

     

}
