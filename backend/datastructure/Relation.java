package datastructure;

import java.util.ArrayList;
import java.util.List;

// TODO: sikre at alle parametere ikke må fylles

public class Relation {
    private List<Node> endpoints = new ArrayList<>();  // Connected nodes
    private String type;  // Relation type (PS, None, etc)

    /*
    private Node node1;  // From node
    private Node node2;  // To node
    private String type;  //

    */

    // Constructor
    public Relation(List<Node> endpoints, String type) {
        this.endpoints = endpoints;
        this.type = type;
    }

    // Getters
    public List<Node> getEndpoints() {
        return endpoints;
    }

    public String getType() {
        return type;
    }
}
