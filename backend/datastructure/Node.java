package datastructure;

import java.util.ArrayList;
<<<<<<< HEAD
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

=======

public class Node{
    private String id; // id is the unique identifier for each node
    private String aspect;
    private String name;

    public Node(String id, String aspect, String name){
        this.id = id;
        this.aspect = aspect;
        this.name = name;
    }

    public String getId() {
        return id;
    }
    public String getAspect() {
        return aspect;
    }
>>>>>>> parent of 41256c0 (spring boot)
    public String getName() {
        return name;
    }

<<<<<<< HEAD
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
=======
}
>>>>>>> parent of 41256c0 (spring boot)
