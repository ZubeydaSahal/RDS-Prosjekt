package com.rds.datastructure;

import com.rds.graph_view.*;

import java.util.List;
import java.util.Map;

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

        /*graph.createOrUpdateNode("BB","%" ,"{name:'Child1'}");
        graph.createOrUpdateNode("XX.XB.B1","-", "{name:'ChildXB'}");
        graph.createOrUpdateNode("XX","-", "{name:'ChildX'}");
        graph.createOrUpdateNode("BB.CC","%", "{name:'Child2'}");
        graph.createOrUpdateNode("XX.XA","-", "{name:'ChildXA'}");
        graph.createOrUpdateNode("XX.XB","-", "{name:'ChildXB'}");
        graph.createOrUpdateNode("QB","=" , null);
        graph.createOrUpdateNode("QB.BB1","=" , null);
        graph.createOrUpdateNode("QB.BB2","=" , null);
        graph.createOrUpdateNode("QB.BB3","=" , null);
        graph.createOrUpdateNode("QB.BB4","=" , null);
        graph.createOrUpdateNode("QB.BB5","=" , null);
        graph.createOrUpdateNode("QB.BB6","=" , null);*/

        // --- % aspekt ---
        graph.createOrUpdateNode("PA","%" , null);
        graph.createOrUpdateNode("PA.BB1","%" , null);
        graph.createOrUpdateNode("PA.BB1.CC1","%" , null);
        graph.createOrUpdateNode("PA.BB2","%" , null);
        graph.createOrUpdateNode("PA.BB2.CC2","%" , null);
        graph.createOrUpdateNode("PA.BB3","%" , null);
        graph.createOrUpdateNode("PA.BB4","%" , null);

// --- - aspekt ---
        graph.createOrUpdateNode("QA","-" , null);
        graph.createOrUpdateNode("QA.DD1","-" , null);
        graph.createOrUpdateNode("QA.DD1.EE1","-" , null);
        graph.createOrUpdateNode("QA.DD2","-" , null);
        graph.createOrUpdateNode("QA.DD2.EE2","-" , null);
        graph.createOrUpdateNode("QA.DD3","-" , null);
        graph.createOrUpdateNode("QA.DD4","-" , null);

// --- + aspekt ---
        graph.createOrUpdateNode("RA","+" , null);
        graph.createOrUpdateNode("RA.FF1","+" , null);
        graph.createOrUpdateNode("RA.FF1.GG1","+" , null);
        graph.createOrUpdateNode("RA.FF2","+" , null);
        graph.createOrUpdateNode("RA.FF2.GG2","+" , null);
        graph.createOrUpdateNode("RA.FF3","+" , null);
        graph.createOrUpdateNode("RA.FF4","+" , null);

// --- $ aspekt ---
        graph.createOrUpdateNode("SA","$" , null);
        graph.createOrUpdateNode("SA.HH1","$" , null);
        graph.createOrUpdateNode("SA.HH1.II1","$" , null);
        graph.createOrUpdateNode("SA.HH2","$" , null);
        graph.createOrUpdateNode("SA.HH2.II2","$" , null);
        graph.createOrUpdateNode("SA.HH3","$" , null);
        graph.createOrUpdateNode("SA.HH4","$" , null);


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
        for (Relation rel : graph.getCrossRelations()) {
            System.out.println(rel.getType());
            System.out.println(rel.getNodeA().getId());
            System.out.println(rel.getNodeB().getId()+"\n\n");
        }

        System.out.println("\n\n=== Sorterte lister ===:\n");

        ViewBuilder viewBuilder = new ViewBuilder();
        viewBuilder.buildAspectLists(graph);

    }
}