package com.rds.graph_view;


import java.util.*;

import com.rds.datastructure.GraphManager;
import com.rds.datastructure.Node;
import com.rds.datastructure.Relation;
import com.rds.graph_view.DTO.*;

import javax.swing.*;


public class ViewBuilder {
    /* Builds a visualization-friendly view of the graph datastructure, without altering the datastructure itself
    * Contains two attributes:
    *   - HashMap 'nodesByAspect': map containing a list for each aspect (key) and the sorted nodes in each list (value)
    *   - HashSet 'crossRelations': A set (unordered list) containing each crossrelation
    * Frontend receives a JSON object containing these two attributes
    * */
    private Map<String, List<NodeDTO>> nodesByApsect = new HashMap<>();  // Map<aspect, List<NodeDTO>>)
    private Set<RelationDTO> crossRelationDTO = new HashSet<>();  // Relations

    // ==== Getters =====
    public Map<String, List<NodeDTO>> getNodesByApsect() {
        return nodesByApsect;
    }

    public Set<RelationDTO> getCrossRelations() {
        return crossRelationDTO;
    }

    // ===== Node mapper =====
    private NodeDTO nodeToDTO(Node node) {
        /* Maps a single node (from datastructure type) to nodeDTO type, to avoid transferring revealing data */
        return new NodeDTO(
                node.getId(),
                node.getCode(),
                node.getLevel()
        );
    }

    // ===== Relation mapper =====
    /*private RelationDTO relationToDTO(Relation relation){
        return new RelationDTO(
                // Convert nodes in relation to NodeDTOs
                nodeToDTO(relation.getNodeA()),
                nodeToDTO(relation.getNodeB()),
                relation.getType()
        );
    }*/
    private RelationDTO relationToDTO(Relation relation){
        return new RelationDTO(
                // Convert nodes in relation to NodeDTOs
                relation.getNodeA().getId(),
                relation.getNodeB().getId(),
                relation.getType()
        );
    }


    // ===== Sets 'nodesByAspect' =====
    public void buildAspectLists(Map<String, Node> nodeMap) {
        /*  Build Lists for each aspect and put all nodes in corresponding lists
        * Input: HashMap containing all nodes (extracted from 'graph' – a GraphManager instance)
        * - Creates a list for each new aspect
        * - Adds all nodes to their respective lists
        * - Sorts each list based on the nodes' ids
        * Output: none, it sets this instance of ViewBuilder's attribute 'nodesByAspect'
        * */

        // ––––– Group nodes by aspekt –––––
        // Iterate through each node
        for (Node node : nodeMap.values()) {

            String aspect = node.getAspect(); // Extract aspect

            //If its aspect isn't in the hashmap, add it
            if (!nodesByApsect.containsKey(aspect)) {
                nodesByApsect.put(aspect, new ArrayList<NodeDTO>());
            }

            // Else add to their aspects' list, converted to DTO
            nodesByApsect.get(aspect).add(nodeToDTO(node));
        }

        // ––––– Sort each list based on the nodes' ids –––––
        for(List<NodeDTO> aspectList: nodesByApsect.values()){
            aspectList.sort(Comparator.comparing(NodeDTO::getId));
        }

        // ==== TEST print ===== TO BE REMOVED / TEMP
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

    // ===== Orchestrator function =====
    public GraphViewDTO buildView(GraphManager graph){
        /* Orchestrator function, which uses a  datastructure as input and calls other functions to convert data to a
        * view for frontend, containing only requested, formatted data.
        * Input: graph (GraphManager instance)
        * - Calls 'buildAspectList': to create a transfer object containing nodes and set 'nodesByAspect'
        * - Extracts and sets 'crossRelations' from graph (GraphManager instance)
        * Returns: view (ViewBuilder instance) - filtered and formatted selections of the data
        * */

        // Build Lists per aspect and put all nodes in corresponding lists
        this.buildAspectLists(graph.getNodeList());

        // Extract list of relations from graph and convert to relationDTOs
        for (Relation relation : graph.getCrossRelations()){
            this.crossRelationDTO.add(relationToDTO(relation));
        }
        // Debug ecrtra array sendt til frontend
        System.out.println("<Viewbuilder> 'corssrelation' size: " +crossRelationDTO.size());
        for (RelationDTO relation : this.crossRelationDTO){
            System.out.println("<>Node A: "+ relation.getNodeA());
        }


        /*// Debugging missing relations
        System.out.println("<ViewBuilder> crossrelations: ");
        for(Relation relationDTO : this.crossRelation){
            System.out.println(relationDTO.getNodeB());
        }*/

        return new GraphViewDTO(
                this.getNodesByApsect(),
                this.getCrossRelations()
        );
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