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

    // Return other node in a
    public Node getOtherNode(Node current){
        // TODO: returnerer 2. node i 1. relasjon en node deltar i, kan være flere for current
        if(current.equals(nodeA)) {
            return nodeB;
        }
        if(current.equals(nodeB)) {
            return nodeA;
        }
        // Should never be reached
        throw new IllegalArgumentException("This node: "+current.getId()+" is not part of a relation");
    }
}
