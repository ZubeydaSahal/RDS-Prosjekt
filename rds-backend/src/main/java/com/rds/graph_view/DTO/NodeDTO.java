package com.rds.graph_view.DTO;

public class NodeDTO {
    /* Data transfer object for nodes to hide non-required information in backend */

    // ===== Attributes =====
    private String id;
    private String code;
    private String name;
    private int level;

    // ===== Constuctor =====
    public NodeDTO(String id, String code, String name, int level) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.level = level;
        // aspect?
    }

    // ===== Getters =====
    public String getId() { return id; }
    public String getCode(){return code;}
    public String getName() { return name; }
    public int getLevel() { return level; }
}
