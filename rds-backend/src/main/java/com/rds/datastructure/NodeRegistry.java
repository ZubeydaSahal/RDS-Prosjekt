package com.rds.datastructure;
import java.util.*;

public class NodeRegistry {
    private Map<String, List<Node>> nodes = new LinkedHashMap<>();  //
    
    private List<String> aspects = new ArrayList();  //lists of aspects 
    //  Hardkode aspekter istedenfor String?
        return nodes;
    public Map<String, List<Node>> getNodes() { 
        return nodes;
    }
    
    public List<Node> getNodesByAspect(String aspect){
         // Add aspect to list if not initialized - kan fjernes om aspekter hardkodes
        if (!aspects.contains(aspect)){
            System.out.println("Aspect: " + aspect + " does not exist");  //TODO: improve error handling/logging
            return null;
            }

        return nodes.get(aspect);  // returns all sub-nodes of the aspect
    }

    public Node getNodeById(String id){
        String aspect = id.substring(0, 1); //henter ut aspektet fra første teng i iden. 

        List<Node> nodesInAspect = getNodesByAspect(aspect); //Uses getNodesByAspect to get the right list of nodes
        //goes through the list
        for(Node node:NodesInAspect){
            if(node.getId().equals(id)){
                return node;  //return node if id matches
            }

        }
        return null; //if it is not found
    }


    public void addNode(Node node, String aspect) {
        // kansje lage en aspect klasse

        // add apsect to list if it doesn't exist
        if(!nodes.containsKey(aspect)){
            nodes.put(aspect, new ArrayList<>());
        }
        // Add node with aspect as key, to registry
        nodes.get(aspect).add(node);
    }


    public void addAspects(String aspect) {
        this.aspects.add(aspect);  // add aspect to list
        nodes.put(aspect, new ArrayList<>());  // initiate empty list for this aspect
    }
}