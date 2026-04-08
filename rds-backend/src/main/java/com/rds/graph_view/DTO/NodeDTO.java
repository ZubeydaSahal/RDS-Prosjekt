package com.rds.graph_view.DTO;

public class NodeDTO {
    /* Data transfer object for nodes to hide non-required information in backend */

    String id;
    String name;
    int level;

    // ===== Constuctor =====
    public NodeDTO(String id, String name, int level) {
        this.id = id;
        this.name = name;
        this.level = level;
        // aspect?
    }

    // ===== Getters =====
    public String getId() { return id; }
    public String getName() { return name; }
    public int getLevel() { return level; }
}
