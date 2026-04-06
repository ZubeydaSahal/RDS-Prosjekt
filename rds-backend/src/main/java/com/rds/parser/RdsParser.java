//<<<<<<<< HEAD:backend/Parser/RdsParser.java

package com.rds.parser;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.rds.datastructure.GraphManager;
import com.rds.datastructure.Relation;
import com.rds.datastructure.Node;

//the function NodeChecker and RelationChecker are placeholders.
public class RdsParser {
    private boolean topNodeDeclared = false;

    // receives the whole script as a string, splits it into lines and processes each line according to the RDS syntax rules.
    public GraphManager parse(String script){
        GraphManager graphManager = new GraphManager();
        System.out.println(script);
        String[] lines = script.split("\\r?\\n");
        int lineNumber = 0;

        // 1. it checks if the topNode is declared or not in the first line
        // 2. checks the line for explicit relation being declared
        // 3. checks the line for which aspect the line belongs to, stores it, then removes the symbol.
        // 4. checks the line and calls function to create every node.
        for (String line : lines) {
            lineNumber++;
            String trimmedLine = line.trim();

            if (trimmedLine.isEmpty()) continue;

            // Check for top node declaration
            if (!topNodeDeclared) {CheckForTopNode(trimmedLine,graphManager);}
            // check for explicit relationship
            else if (trimmedLine.contains("||")) {
                CheckExplicitRelationForName(trimmedLine, graphManager);
            }else {
                // check for aspect and remove aspect symbol
                String aspect = checkAspect(trimmedLine);
                trimmedLine = trimmedLine.substring(1).trim();

                // Normal RDS line
                CheckNodes(trimmedLine, aspect,graphManager);
                System.out.println(lineNumber);

            }
        }
        graphManager.finalizeGraph();
        return graphManager;
        
        }

    
    //processs a RDS line.
    //build a full id  for each node and creats  relation between them 

    private void CheckNodes(String trimmedLine, String aspect, GraphManager graphManager) {
        String[] nodes = trimmedLine.split("\\.");
        String previousFullId = null; // keeps truck of previous id
        String currentFullId=""; //keeps truck of the id being built 
        int depth = 0;

        // for each node in line, check if it has a name and then check the relationship between them
        for (String node : nodes){
            depth++;
            String id;
            String name = null;

            if (node.contains("(") && node.contains(")")) {
                int startIndex = node.indexOf("(");
                int endIndex = node.indexOf(")");

                id = node.substring(0, startIndex);
                name = node.substring(startIndex + 1, endIndex);
            } else {
                id = node;
            }

            
            if(currentFullId.isEmpty()){
                currentFullId = aspect + id;
            } else {
                currentFullId = currentFullId + "." + id;
            }
            
            NodeChecker(currentFullId, aspect, name, graphManager); //creats or update node in graph manager
            
            // implicit relationship between nodes
            if (previousFullId != null){
                RelationChecker(previousFullId, aspect, currentFullId, aspect, null, graphManager);
            }
            previousFullId = currentFullId; //update previousid
        }
    }
    //creats relation bewteen nodes in graphmanger
    //creats nodes only when nodes exist
    private void RelationChecker(String fromId, String aspectFrom, String toId, String aspectTo, String type, GraphManager graphManager) {
        graphManager.createRelation(fromId, aspectFrom, toId, aspectTo, type);
}

    //creats or update node in graphmanger. 
    private void NodeChecker(String fullId, String aspect, String name, GraphManager graphManager) {
        graphManager.createOrUpdateNode(fullId, aspect, name);
    }
    

    private void CheckExplicitRelationForName(String trimmedLine, GraphManager graphmanger) {
        String relationName = checkExplicitRelationName(trimmedLine);
        String[] parts;

        if (relationName != null){
            parts = trimmedLine.split("\\|\\|" + relationName + "\\|\\|");
        } else {
            parts = trimmedLine.split("\\|\\|");
        }

        //process leftsidde
        String leftSide = parts[0].trim();
        String leftNodeAspect = checkAspect(leftSide);
        leftSide=leftSide.substring(1).trim(); // remove aspect symbol
        CheckNodes(leftSide, leftNodeAspect,graphmanger);

        String rightSide = parts[1].trim();
        String rightNodeAspect = checkAspect(rightSide);
        rightSide=rightSide.substring(1).trim(); // remove aspect symbol
        CheckNodes(rightSide, rightNodeAspect, graphmanger);

        //gets last node from each side of a explicit relation
        String leftLastId=leftNodeAspect+leftSide.split("\\.")[leftSide.split("\\.").length-1];
        String rightLastId=rightNodeAspect+rightSide.split("\\.")[rightSide.split("\\.").length-1];

        //Creats explicit relation 
        RelationChecker(leftLastId, null,rightLastId, null,relationName, graphmanger);
        
    }

    private void CheckForTopNode(String trimmedLine, GraphManager graphManager) {
        if (trimmedLine.startsWith("<") && trimmedLine.endsWith(">")) {
            String topNodeName = trimmedLine.substring(1, trimmedLine.length() - 1);
            CreateTopNode(topNodeName, graphManager);
            topNodeDeclared = true;
        } else {
            throw new IllegalArgumentException("Top node declaration is missing or malformed: " + trimmedLine);
        }
    }
    // Midlertidig test av parser

    // printer ut navn av toppnode.
    private void CreateTopNode(String topNodeName, GraphManager graphManager) {
        System.out.println("Creating top node " + topNodeName);
        graphManager.setRoot(topNodeName);
    }

    // Check aspect from first symbol
    private String checkAspect(String line) {

        char first = line.charAt(0);

        return switch (first) {
            case '-' -> "-";
            case '=' -> "=";
            case '%' -> "%";
            case '$' -> "$";
            default -> throw new RuntimeException("Invalid aspect symbol. " + line );
        };
    }    

    // check if explicit relationship has a name
    private String checkExplicitRelationName(String line) {
        // Named relation has pattern ||NAME||
        int first = line.indexOf("||");
        int second = line.indexOf("||", first + 2);

        if (first != -1 && second != -1) {

            String between = line.substring(first + 2, second).trim();

            if (!between.isEmpty()) {
                return between;
            }
        }

        return null;
    }

    // get Last Node from line
    //TODO: needs to return the last node, but also make sure its from the correct aspect.
    private String getLastNode(String line){
        return null;
    }
}