package com.rds.datastructure;


import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

public class GraphManager {
    // Attributes
    private Map<String, List<Node>> nodes = new LinkedHashMap<>();  // nodes 'id' as key
    private Set<Relation> relations = new HashSet<>();  // Relations


    
    public void addNode(Node node){
        String aspect = node.getId().substring(0,1); //gets aspect from node id, assuming aspect is the first character of the id
        if(!nodes.containsKey(aspect)){ //sjekker om aspect finnes fra før
            nodes.put(aspect, new ArrayList<>()); //nei, legger til en ny liste for denne aspektet
        } //else hopper vi over, fordi aspektet allerede finnes
        nodes.get(aspect).add(node); //legger til noden i aspektets liste
     
         
    }
    //finner en spesifikk node ved id
    //brukes av addreltion for å validere at noder finnes før en relasjon opprettes
    public Node getNodeById(String id){
        String aspect=id.substring(0,1);
        List<Node> aspectNodes=nodes.getOrDefault(aspect, new ArrayList<>());
        for(Node node: aspectNodes){
            if(node.getId().equals(id)){
                return node;
            }
        }
        return null;
    }
    
    //retunerer alle noder som tilhører et gitt aspect.
    //brukes når vi vil foreksempel filtere på aspekt.
    public List<Node> getNodesByAspect(String aspect){
        return nodes.getOrDefault(aspect, new ArrayList<>()); 
    }

    //skal hente noder i en gitt rot id
    /* public List<Node> getSubtree(String id){
      
    }*/


    // adds relation between two nodes
    //valides that both nodes exist before creating relation
    public void addRelation(Relation relation){
        //looks up the nodes by id to verify they exist before adding the relation
        Node fraNode = getNodeById(relation.getNodeA().getId());
        Node tilNode = getNodeById(relation.getNodeB().getId());

        //validate
        if(fraNode==null){
            System.out.println("Advarsel: " + relation.getNodeA().getId() + " does not exist");
            return;
        }
        if (tilNode==null){
            System.out.println("Advarsel: " + relation.getNodeB().getId() + " does not exist");
            return;
            
        }
        relations.add(relation); //both nodes exist, add relation
    }
    //
    public Set<Relation> getRelations(){
        return relations;
    }

    
    public Node createOrUpdateNode(String id, String metadata){
        Node node = getNodeById(id); //check if node already exists
        if (node == null) {
            node = new Node(id); //if nodes does not exist create new node
            addNode(node);
        }   
        node.updateNode(metadata); //update node metadata
        return node;
    }

    



















/*
    public void nodeChecker(String id, String code, String aspect){
        //NodeChecker(id, name, aspect);  - mener konrad name = sporveksel eller AA

        // Check all existing nodes by aspect
        for (Node node : nodes.getNodesByAspect(aspect)){
            if(id == node.getId()){
                System.out.println("Node exists: " + id);
            }
            else{
                createNode(id, code, aspect);
            }
        }


    }


    public void createNode(String id, String code, String aspect){
        // Anta nivå kommer som input?
        Node node = new Node(id, code);  // create node
        nodes.addNode(node, aspect);  // add node to registry 'nodes'

    }

    public void createRelation(String firstNode, String secondNode, String type){
        // RelationChecker(leftNode, rightNode, "type")
        // TODO: sikre at type kan være None
        //Node firstNode = nodes.getNodesById()

    }

*/
}
