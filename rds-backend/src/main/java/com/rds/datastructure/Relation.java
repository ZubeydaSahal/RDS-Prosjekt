package datastructure;

<<<<<<< HEAD
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
=======
public class Relation{
    private String fromId; //which node the relation starts from
    private String toId;  //which node the relation ends at
    private String type; //the type of relation it is 


    public Relation(String fromId, String toId, String type){
        this.fromId = fromId;
        this.toId = toId;
        this.type = type;
    }


}
 
>>>>>>> parent of 41256c0 (spring boot)
