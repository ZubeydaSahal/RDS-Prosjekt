package com.rds.graph_view.DTO;

public class RelationDTO {
    /* Data transfer object for relations to hide non-required information in backend
    * Datastructures relations contain extra information about the nodes*/

    // Connected nodes
    private final String node1;
    private final String node2;
    private final String type;



    // ===== Constructor =====
    public RelationDTO(String nodeA, String nodeB, String type) {
        this.node1 = nodeA;
        this.node2 = nodeB;
        this.type = type;
    }

    // ===== Getters =====
    public String getNode1() {
        return node1;
    }
    public String getNode2() {
        return node2;
    }
    public String getType() {
        return type;
    }
}
