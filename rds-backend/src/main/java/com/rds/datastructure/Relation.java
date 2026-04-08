package com.rds.datastructure;

// TODO: sikre at type kan være null

public class Relation {
    // Connected nodes
    private final Node nodeA;  // Always parent in 'hierarchy' type
    private final Node nodeB;  // Always child in 'hierarchy' type
    private final String type;  // Relation type (PS, None, etc)



    // Constructor
    public Relation(Node nodeA, Node nodeB, String type) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.type = type;
        if(type==null) {System.out.println("<Relation> Constructor: " + type);}  // Sean debugger manglende relasjoner
    }

    // Getters
    public Node getNodeA() {
        // GetParent, if type is 'hierarchical'
        return nodeA;
    }

    public Node getNodeB() {
        // GetChild, if type is 'hierarchical'
        return nodeB;
    }

    public String getType() {
        System.out.println("<Relation> kaller GetType");  // Sean debugger manglende relasjoner
        return type;
    }

    // Return other node in a
    public Node getOtherNode(Node current){
        // TODO: returnerer 2. node i 1. relasjon en node deltar i, kan være flere for current
        // SEan debugger "Error  line 3: Cannot invoke "String.equals(Object)" because "type" is null"
        if(type==null) {
            System.out.println("<Relation> inneholder equals");
        }

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
