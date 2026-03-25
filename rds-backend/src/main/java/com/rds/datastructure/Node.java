package com.rds.datastructure;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;


// TODO:
//  - sikre at alle parametere ikke må fylles
//  - Node sletting, om linjen fjernes, må noden slettes
//      - Enten generer ny struktur hver gang
//      - Eller mekasime for å oppdage endring i input linjer
//   .
//   **
//  - Noder skal kunne deklareres iumplisitt: AA.BB, hvis AA ikke eksisterer, skap AA, BB or relasjonen(A,B)
//   **
//   .
//  - Assumes each node will be declared with full path e.g: AA.BB.CC, so CC can not be declared BB.CC, if AA is BB's
//  parent
//

public class
Node {

    // Assumes that id, code and level will never change
    private final String id;    // a.b.c (unique)
    private final String code;  // c
    private final int level;    // node's hierarchical depth
    private String metadata;    // Extra data in JSON (name, ..)
    // TODO: metadata is a placeholder for extra data (name, documentation etc.)
    @JsonIgnore
    private Set<Relation> relations = new HashSet<>();   // Nodes relations
    // ^^ Changed to Set, instead of List because: don't need index, no duplicates allowed


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
        // TODO: replace metadata or handle internal fields seperatly - waiting for specifications of expected data
    }

    // Hanlde relations
    public void addRelation(Relation relation){
        relations.add(relation);
    }
    public Set<Relation> getRelations(){
        return relations;
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

    public String getMetadata() {
        return metadata;
    }

    public String getAspect() {
        return String.valueOf(id.charAt(0));
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