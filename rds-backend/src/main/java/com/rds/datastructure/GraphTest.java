package com.rds.datastructure;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import com.rds.parser.RdsParser;

public class GraphTest {

    public static void main(String[] args) {

        // Test 1 — manuell graf
        GraphManager graph1 = new GraphManager();
        graph1.createOrUpdateNode("AA", "{name:'Root'}");
        graph1.createOrUpdateNode("AA.BB", "{name:'Child1'}");
        graph1.createOrUpdateNode("AA.BB.CC", "{name:'Child2'}");
        graph1.createRelation("AA", "AA.BB.CC", "cross");

        System.out.println("=== MANUELL GRAF ===");
        for (Relation r : graph1.getRelations()) {
            System.out.println(r.getNodeA().getId() +
                " → " + r.getNodeB().getId() +
                " [" + r.getType() + "]");
        }

        // Test 2 — parser + filter
        RdsParser parser = new RdsParser();
        GraphManager graph2 = parser.parse(
            "<TestProsjekt>\n=D1.AA3.ULE1\n=D1.AA3.ULE2"
        );

        // Vis alle relasjoner før filter
        System.out.println("\n=== FØR FILTER ===");
        for (Relation r : graph2.getRelations()) {
            System.out.println(r.getNodeA().getId() +
                " → " + r.getNodeB().getId() +
                " [" + r.getType() + "]");
        }

        // Definer filter og hent filtrerte relasjoner
        Map<String, Boolean> filters = new HashMap<>();
        filters.put("hierarchy", false);
        filters.put("implisitt", true);
        Set<Relation> filtered = graph2.getFilteredRelations(filters);

        // Vis filtrerte relasjoner — originalen i graph2 er urørt
        System.out.println("\n=== ETTER FILTER (hierarchy=false) ===");
        for (Relation r : filtered) {
            System.out.println(r.getNodeA().getId() +
                " → " + r.getNodeB().getId() +
                " [" + r.getType() + "]");
        }
    }
}