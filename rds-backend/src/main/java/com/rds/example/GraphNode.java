package com.rds.example;

public class GraphNode {
    private String id;
    private String name;

    public GraphNode(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getLabel() {
        return name;
    }
}
