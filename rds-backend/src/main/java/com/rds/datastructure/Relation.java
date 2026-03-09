package com.rds.datastructure;

import java.util.ArrayList;
import java.util.List;

// TODO: sikre at type kan være null

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

    public void setToId(String toId) {
        this.toId = toId;
    }

}
