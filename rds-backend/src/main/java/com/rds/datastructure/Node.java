package com.rds.datastructure;

import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;


public class Node {

    // Assumes that id, code and level will never change
    private final String id;    // a.b.c (unique)
    private final String code;  // c
    private String aspect;
    private int level;    // node's hierarchical depth
    private String metadata;    // Extra data in JSON (name, ..)
    // TODO: metadata is a placeholder for extra data (name, documentation etc.)

    @JsonIgnore
    private Set<Relation> hierarchyRelations = new HashSet<>();   // Nodes relations
    // ^^ Changed to Set, instead of List because: don't need index, no duplicates allowed


    // Partial Constructor
    public Node(String id) {
        this.id = id;
        // calculate level and code
        String[] parts = id.split("\\.");
        this.level = parts.length;
        this.code = parts[parts.length - 1];
    }

    // Temp constructor with aspect – refactoring
    public Node(String id, String aspect){
        this(id);
        this.aspect = aspect;
    }

    // Update node
    public void updateNode(String metadata){
        /* Over-writes metadata, if called upon with non-null field
        * Snakke med de andre - kan navn, nivå og id endres? jeg synes Nei
        */
        if (metadata != null) this.metadata = metadata;
        // TODO: replace metadata or handle internal fields seperatly - waiting for specifications of expected data
    }

    // Hanlde relations
    public void addRelation(Relation relation){
        hierarchyRelations.add(relation);
    }
    public Set<Relation> getHierarchyRelations(){
        return hierarchyRelations;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getAspect(){
        return aspect;
    }

    public String getMetadata() {
        return metadata;
    }
  

    // Define nodes as eqqual if 'id' is the same
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;  // return true if same object refernece
        if (!(o instanceof Node node)) return false;  // return false if object is not a Node
        return id.equals(node.id); // nodes are equal if ids are equal
    }

    // bsase hashCode on id, to ensure consistency with equals()
    @Override
    public int hashCode() {
        return id.hashCode();
    }

/*    public int getNodeById(String id) {

    }*/
}