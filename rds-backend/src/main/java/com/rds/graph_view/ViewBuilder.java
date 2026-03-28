package com.rds.graph_view;

import com.rds.datastructure.GraphManager;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.rds.datastructure.Filter;
import com.rds.datastructure.Node;
import com.rds.datastructure.Relation;


public class ViewBuilder {
    /* Builds a visualization-friendly view of the graph datastructure, without altering the datastructure */











    
    //implementer view builder, som tar inn grafen og bygger en view-graf basert på filteret, somkan brukes i frontend
    public static Map<String, Object> build(GraphManager graphManager, Filter filter) {
          // 1. Hent filtrerte noder og relasjoner fra GraphManager
          
        // FilteredNodes er en map med bare de nodene som er aktive i filteret. Hvis % er skrudd av, er ingen %-noder med her.
        Map<String, Node> filteredNodes     = graphManager.getFilteredNodesByAspect(filter.getAspectFilters());
        //Samme for Filtredretion vises hvis bare den er på  
        Set<Relation>     filteredRelations = graphManager.getFilteredRelations(filter.getFilters());
        
        // 2. Bygg node-liste for frontend
        //går gjennom synlig noder og bygger et enkelt objekt med bare feltene frontend trenger.
        List<Map<String, Object>> nodeList = new ArrayList<>();
        for (Node node : filteredNodes.values()) {
            Map<String, Object> n = new LinkedHashMap<>();
            n.put("id",       node.getId());
            n.put("code",     node.getCode());
            n.put("level",    node.getLevel());
            n.put("aspect",   node.getAspect());
            n.put("metadata", node.getMetadata());
            nodeList.add(n);
        }
 
        // 3. Bygg relasjons-liste for frontend
        // Lager et sett med bare ID-ene til synlige noder — brukes til rask oppslag i neste steg.
        Set<String> visibleNodeIds = filteredNodes.keySet();
        /*
        Går gjennom alle relasjon og sjekker at begge noder faktisk er synlige. 
        Dette er viktig fordi en relasjon kan være aktiv for eksempel hierarchy
         men en av nodene kan være skjult av aspekt-filteret.
        */
        List<Map<String, String>> relationList = new ArrayList<>();
        for (Relation relation : filteredRelations) {
            String fromId = relation.getNodeA().getId();
            String toId   = relation.getNodeB().getId();
 
            // Begge noder må være synlige
            if (visibleNodeIds.contains(fromId) && visibleNodeIds.contains(toId)) {
                Map<String, String> r = new LinkedHashMap<>();
                r.put("from", fromId);
                r.put("to",   toId);
                r.put("type", relation.getType());
                relationList.add(r);
            }
        }
 
        // 4. slå sammen liste med noder og relasjoner og sender dette til frontend
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("nodes",     nodeList);
        response.put("relations", relationList);
        return response;
    
    
}
}