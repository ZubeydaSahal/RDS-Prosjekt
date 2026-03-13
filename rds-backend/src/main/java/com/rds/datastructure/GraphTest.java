package com.rds.datastructure;

public class GraphTest {
    public static void main(String[] args) {
        GraphManager graph = new GraphManager();

        // Lag noder
        graph.createOrUpdateNode("=AA.BB.CC", null);
        graph.createOrUpdateNode("=AA.XX.XA", null);
        graph.createOrUpdateNode("=AA.XX.XB", "Sporveksel");

        // Test kryssrelasjoner
        graph.addRelation("=AA.BB.CC", "=AA.XX", "cross");
        graph.addRelation("=AA", "=AA.XX.XB", "cross");

        // Print noder
        System.out.println("Nodes:");
        for (Node node : graph.getAllNodes().values()) {
            System.out.println(node.getId() + " level=" + node.getLevel());
        }

        // Print relasjoner
        System.out.println("\nRelasjoner:");
        for (Relation rel : graph.getRelations()) {
            System.out.println(rel.getNodeA().getId() + " → " + rel.getNodeB().getId() + " (" + rel.getType() + ")");
        }
    }
}
