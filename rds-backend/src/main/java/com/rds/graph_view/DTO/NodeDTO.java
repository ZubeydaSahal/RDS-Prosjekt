package com.rds.graph_view.DTO;

public class NodeDTO {
    String id;
    String name;
    int level;

    public NodeDTO(String id, String name, int level) {
        //node data transfer objects
        this.id = id;
        this.name = name;
        this.level = level;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public int getLevel() { return level; }
}
