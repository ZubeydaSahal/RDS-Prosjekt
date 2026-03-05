package com.rds.datastructure;
import java.util.List;

public class Relation{
    private String toId; //id for node relation points to
    private String fromId; //id for node relation points from
    private String typeRelation; //type of relation

    //Constructor
    public Relation(String toId, String fromId, String typeRelation){
        this.toId=toId;
        this.fromId=fromId;
        this.typeRelation=typeRelation;
    }

    //Getters and setters
    public String getToId() {
        return toId;
    }

    public void setToId(String toId) {
        this.toId = toId;
    }

    public String getFromId() {
        return fromId;
    }

    public void setFromId(String fromId) {
        this.fromId = fromId;
    }

    public String getTypeRelation() {
        return typeRelation;
    }

    public void setTypeRelation(String typeRelation) {
        this.typeRelation = typeRelation;
    }
}