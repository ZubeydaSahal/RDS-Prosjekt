package main.java.com.rds.datastructure;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

// TODO:
//  - sikre at alle parametere ikke må fylles
//  - Node sletting, om linjen fjernes, må noden slettes
//      - Enten generer ny struktur hver gang
//      - Eller mekasime for å oppdage endring i input linjer

public class Node {

    private final String id;    // a.b.c (unique)
    private String code;        // c
    private int level;          // node's hierarchical depth
    private String metadata;    // Extra data in JSON (name, ..)

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
    }

    // Hanlde relations
    public void addrelation(Relation relation){
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