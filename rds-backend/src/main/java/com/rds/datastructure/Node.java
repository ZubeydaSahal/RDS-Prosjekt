package  com.rds.datastructure;
import java.util.ArrayList;
import java.util.List;

public class Node{
    private String id; //id for node
    private String aspect;  
    private String name;
    private int depth;


    public Node(String id, String aspect, String name, int depth) {
        this.id = id;
        this.aspect = aspect;
        this.name = name;
        this.depth = depth;
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
    public int getDepth() {
        return depth;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setAspect(String aspect) {
        this.aspect = aspect;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setDepth(int depth) {
        this.depth = depth;
    }
}