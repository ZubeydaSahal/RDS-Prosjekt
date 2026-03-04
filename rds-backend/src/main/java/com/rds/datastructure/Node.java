package datastructure;

import java.util.ArrayList;
import java.util.List;

// TODO: sikre at alle parametere ikke må fylles

public class Node {
    private String id; // a.b.c
    private String code; // c
    private String name; // Sporveksel
    private int depth; // node's hierarchical level in tree
    private String metadata; // Extra data

    private List<Relation> outgoingRelations = new ArrayList<>();
    private List<Relation> incomingRelations = new ArrayList<>();

    // Partial Constructor
    public Node(String id, String code){
        this.id = id;
        this.code = code;
    }

    // full constructor
    public Node(String id, String code, String name, int depth, String metadata) {
        this(id, code);
        this.name = name;
        this.depth = depth;
        this.metadata = metadata;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public int getDepth() {
        return depth;
    }

    public String getMetadata() {
        return metadata;
    }

    public List<Relation> getOutgoingRelations() {
        return outgoingRelations;
    }

    public List<Relation> getIncomingRelations() {
        return incomingRelations;
    }

    // Add relations
    public void addOutgoingRelation(Relation relation) {
        outgoingRelations.add(relation);
    }

    public void addIncomingRelation(Relation relation) {
        incomingRelations.add(relation);
    }
}