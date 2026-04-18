package com.rds.graph_view.DTO;

public class NodeDTO {
    /* Data transfer object for nodes to hide non-required information in backend */

    // ===== Attributes =====
    private String id;
    private String code;
    private int depth;
    private String name;
    private int level;

    // ===== Constuctor =====
    public NodeDTO(String id, String code, int depth, String name, int level) {
        this.id = id;
        this.code = code;
        this.depth = depth;
        this.name = name;
        this.level = level;
        // aspect?
    }

    // ===== Getters =====
    public String getId() { return id; }

    public int getDepth() {
        return depth;
    }

    public String getCode(){return code;}
    public String getName() { return name; }
    public int getLevel() { return level; }
}
