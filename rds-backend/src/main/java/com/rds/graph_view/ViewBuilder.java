package com.rds.graph_view;


import com.rds.datastructure.GraphManager;
import com.rds.datastructure.GraphTest;

import java.rmi.UnexpectedException;
import java.util.*;
import java.util.stream.Collectors;

import com.rds.datastructure.Filter;
import com.rds.datastructure.Node;
import com.rds.datastructure.Relation;
import com.rds.graph_view.DTO.*;



public class ViewBuilder {
    /* Builds a visualization-friendly view of the graph datastructure, without altering the datastructure */
    private Map<String, List<NodeDTO>> nodesByApsect = new HashMap<>();  // Map<aspect, List<NodeDTO>>)
    private Set<Relation> crossRelations = new HashSet<>();  // Relations

    private NodeDTO toDTO(Node node) {
        // Maps a node to nodeDTO class
        return new NodeDTO(
                node.getId(),
                node.getCode(),
                node.getLevel()
        );
    }

    public Map<String, List<NodeDTO>> getNodesByApsect() {
        return nodesByApsect;
    }

    public Set<Relation> getCrossRelations() {
        return crossRelations;
    }

    public void buildAspectLists(Map<String, Node> nodeMap) {

        // === Group nodes by aspekt ===

        // Iterate through each node
        for (Node node : nodeMap.values()) {
            String aspect = node.getAspect();

            //If its aspect isn't in the hashmap, add it
            if (!nodesByApsect.containsKey(aspect)) {
                nodesByApsect.put(aspect, new ArrayList<NodeDTO>());
            }

            // Else add to their aspects' list, converted to DTO
            nodesByApsect.get(aspect).add(toDTO(node));
        }

        // === Sort lists based on node ids ===
        for(List<NodeDTO> aspectList: nodesByApsect.values()){
            aspectList.sort(Comparator.comparing(NodeDTO::getId));
        }

        // ==== TEST print =====
        for (Map.Entry<String, List<NodeDTO>> entry : nodesByApsect.entrySet()) {
            String aspect = entry.getKey();
            List<NodeDTO> aspectList = entry.getValue();

            // System.out.println("==== Aspekt: " + aspect + "===="); //temp komm ut
            for (NodeDTO node : aspectList){
                //System.out.println(node.getId());  // temp komment ut
            }
            System.out.println("\n\n");
        }
    }

    public void getRelations(GraphManager graphManager){
        crossRelations = graphManager.getCrossRelations();
    }

    public ViewBuilder buildView(GraphManager graphManager){

        // Filter options …

        // Build Lists for all nodes per aspect
        this.buildAspectLists(graphManager.getNodeList());

        // Get relation list
        this.crossRelations = graphManager.getCrossRelations();

        // Debugging missing relations
        System.out.println("<ViewBuilder> crossrelations: ");
        for(Relation relation : this.crossRelations){
            System.out.println(relation.getNodeB());
        }

        return this;
    }
}

//implementer view builder, som tar inn grafen og bygger en view-graf basert på filteret, somkan brukes i frontend
    /*public static Map<String, Object> build(GraphManager graphManager, Filter filter){
            // 1. Hent filtrerte noder og relasjoner fra GraphManager

            // FilteredNodes er en map med bare de nodene som er aktive i filteret. Hvis % er skrudd av, er ingen %-noder med her.
            Map<String, Node> filteredNodes = graphManager.getFilteredNodesByAspect(filter.getAspectFilters());
            //Samme for Filtredretion vises hvis bare den er på
            Set<Relation> filteredRelations = graphManager.getFilteredRelations(filter.getFilters());

            // 2. Bygg node-liste for frontend
            //går gjennom synlig noder og bygger et enkelt objekt med bare feltene frontend trenger.
            List<Map<String, Object>> nodeList = new ArrayList<>();
            for (Node node : filteredNodes.values()) {
                Map<String, Object> n = new LinkedHashMap<>();
                n.put("id", node.getId());
                n.put("code", node.getCode());
                n.put("level", node.getLevel());
                n.put("aspect", node.getAspect());
                n.put("metadata", node.getMetadata());
                nodeList.add(n);
            }

            // 3. Bygg relasjons-liste for frontend
            // Lager et sett med bare ID-ene til synlige noder — brukes til rask oppslag i neste steg.
            Set<String> visibleNodeIds = filteredNodes.keySet();
        *//*
        Går gjennom alle relasjon og sjekker at begge noder faktisk er synlige.
        Dette er viktig fordi en relasjon kan være aktiv for eksempel hierarchy
         men en av nodene kan være skjult av aspekt-filteret.
        *//*
            List<Map<String, String>> relationList = new ArrayList<>();
            for (Relation relation : filteredRelations) {
                String fromId = relation.getNodeA().getId();
                String toId = relation.getNodeB().getId();

                // Begge noder må være synlige
                if (visibleNodeIds.contains(fromId) && visibleNodeIds.contains(toId)) {
                    Map<String, String> r = new LinkedHashMap<>();
                    r.put("from", fromId);
                    r.put("to", toId);
                    r.put("type", relation.getType());
                    relationList.add(r);
                }
            }

            // 4. slå sammen liste med noder og relasjoner og sender dette til frontend
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("nodes", nodeList);
            response.put("relations", relationList);

        return null;//response;

        }*/