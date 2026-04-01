package com.rds.datastructure;

public class GraphTest {

    public static void main(String[] args) {

        GraphManager graph = new GraphManager();

        /*// Opprett noen noder
        graph.createOrUpdateNode("AA", "{name:'Root'}");
        graph.createOrUpdateNode("AA.BB", "{name:'Child1'}");
        graph.createOrUpdateNode("AA.BB.CC", "{name:'Child2'}");
        graph.createOrUpdateNode("AA.XX", "{name:'ChildX'}");
        graph.createOrUpdateNode("AA.XX.XA", "{name:'ChildXA'}");
        graph.createOrUpdateNode("AA.XX.XB", "{name:'ChildXB'}");
        graph.createOrUpdateNode("AA.XX.XB.B1", "{name:'ChildXB'}");

        // Lag en ekstra relasjon
        graph.createRelation("AA", "AA.BB.CC", "cross");
        graph.createRelation("AA.BB.CC", "AA.XX", "cross");*/

        // Opprett noen noder - uten rot node
        //graph.createOrUpdateNode("", "{name:'Root'}");
        graph.setRoot("AA");

        graph.createOrUpdateNode("BB","%" ,"{name:'Child1'}");
        graph.createOrUpdateNode("BB.CC","%", "{name:'Child2'}");
        graph.createOrUpdateNode("XX","-", "{name:'ChildX'}");
        graph.createOrUpdateNode("XX.XA","-", "{name:'ChildXA'}");
        graph.createOrUpdateNode("XX.XB","-", "{name:'ChildXB'}");
        graph.createOrUpdateNode("XX.XB.B1","-", "{name:'ChildXB'}");

        // Test create node with aspect
        graph.createOrUpdateNode("MM","$", "Aspected Node");

        // Lag en ekstra relasjon
        graph.createRelation("XX", "-", "BB.CC", "%", "cross");
        graph.createRelation("BB.CC", "%", "XX.XB", "-", "cross");

        graph.finalizeGraph();

        // Print alle noder
        System.out.println("Nodes:");
        for (Node node : graph.getNodes()) {
            System.out.println(node.getId() + ", lev: "+ node.getLevel()+", aspect: "+node.getAspect());
        }

        // Print grafen
        System.out.println("\nGraph structure:");
        graph.printGraph();

        // Print relasjoner
        System.out.println("\nRelations:");
        for (Relation rel : graph.getRelations()) {
            System.out.println(rel.getType());
            System.out.println(rel.getNodeA().getId());
            System.out.println(rel.getNodeB().getId()+"\n\n");
        }
    }
}