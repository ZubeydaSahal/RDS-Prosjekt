package com.rds.datastructure;

import java.util.*; 

public class Node {

    private final String id;    // a.b.c (unique)
    private String code;        // c
    private int level;          // node's hierarchical depth
    private String metadata;    // Extra data in JSON (name, ..)


    // Partial Constructor
    public Node(String id){
        this.id = id;
        // calculate level and code
        String[] parts = id.split("\\.");
        this.level = parts.length;
        this.code = parts[parts.length - 1];
    }

    // Update node
    public void updateNode(String metadata){
        /* Over-writes metadata, if called upon with non-null field
        * Snakke med de andre - kan navn, nivå og id endres? jeg synes Nei
        */
        if (metadata != null) this.metadata = metadata;
    }

    // Getters

    public String getId() {
        return id;
    }
    public String getAspect() {
        return id.substring(0,1);
    }

    public int getLevel() {
        return level;
    }

    public void setCode(String code) {
        this.code = code;
    }
    public String getMetadata() {
        return metadata;
    }

     @Override
    public boolean equals(Object o) {
        if (this == o) return true;  // return true if same object refernece
        if (!(o instanceof Node node)) return false; // return false if object is not a Node
        return id.equals(node.id); // nodes are equal if ids are equal
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

}