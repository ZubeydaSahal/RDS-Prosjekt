package com.rds.example;

public class GraphRelation {
    private String source;
    private String target;
    private String label;

    public GraphRelation(String source, String target, String label) {
        this.source = source;
        this.target = target;
        this.label = label;
    }

    public String getSource() {
        return source;
    }

    public String getTarget() {
        return target;
    }

    public String getLabel() {
        return label;
    }
}
