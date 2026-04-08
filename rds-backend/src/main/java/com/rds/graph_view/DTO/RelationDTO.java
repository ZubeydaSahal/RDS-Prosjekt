package com.rds.graph_view.DTO;

public class RelationDTO {
    /* Data transfer object for relations to hide non-required information in backend
    * Datastructures relations contain extra information about the nodes*/

    // Connected nodes
    private final String nodeA;
    private final String nodeB;
    private final String type;



    // ===== Constructor =====
    public RelationDTO(String nodeA, String nodeB, String type) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.type = type;
    }

    // ===== Getters =====
    public String getNodeA() {
        return nodeA;
    }
    public String getNodeB() {
        return nodeB;
    }
    public String getType() {
        return type;
    }
}
