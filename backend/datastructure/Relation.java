package datastructure;

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
 