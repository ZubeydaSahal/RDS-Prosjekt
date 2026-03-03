import java.util.ArrayList;


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
    public String getName() {
        return name;
    }

}
