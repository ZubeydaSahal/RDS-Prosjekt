//<<<<<<<< HEAD:backend/Parser/RdsParser.java

package com.rds.parser;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

//the function NodeChecker and RelationChecker are placeholders.
public class RdsParser {
    private boolean topNodeDeclared = false;

    // receives the whole script as a string, splits it into lines and processes each line according to the RDS syntax rules.
    public void parse(String script){
    
        String[] lines = script.split("\\r?\\n");
        int lineNumber = 0;

        // 1. it checks if the topNode is declared or not in the first line
        // 2. checks the line for explicit relation being declared
        // 3. checks the line for which aspect the line belongs to, stores it, then removes the symbol.
        // 4. checks the line and calls function to create every node.
        for (String line : lines) {
            lineNumber++;
            String trimmedLine = line.trim();

            if (trimmedLine.isEmpty()) return;

            // Check for top node declaration
            if (!topNodeDeclared) {CheckForTopNode(trimmedLine);}

            // check for explicit relationship
            if (trimmedLine.contains("||")) {CheckExplicitRelationForName(trimmedLine);}

            // check for aspect and remove aspect symbol
            String aspect = checkAspect(trimmedLine);
            trimmedLine = trimmedLine.substring(1).trim();
            
            // Normal RDS line
            CheckNodes(trimmedLine, aspect);
        }
    }
    //
    private void CheckNodes(String trimmedLine, String aspect) {
        String[] nodes = trimmedLine.split("\\.");
        String previousNode = null;

        // for each node in line, check if it has a name and then check the relationship between them
        for (String node : nodes){

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
            // Placeholder
            NodeChecker(id, name, aspect);

            // implicit relationship between nodes
            if (previousNode != null){
                // Placeholder
                RelationChecker(previousNode, aspect, id, aspect, "implisitt");
            }
            previousNode = id;
        }
    }
    // placeholder
    // midlertidig for å se at parser funker
    private void RelationChecker(String previousNode, String aspect, String id, String aspect1, String name) {
        System.out.println("Relation between " + previousNode + " and " + aspect + " " + id + " " + aspect1 + " with name: " + name);
    }
    // placeholder
    // midlertidig for å se at parser funker
    private void NodeChecker(String id, String name, String aspect) {
        System.out.println("Node created with ID: " + id + " and name " + name + " and aspect " + aspect);
    }

    private void CheckExplicitRelationForName(String trimmedLine) {
        String relationName = checkExplicitRelationName(trimmedLine);
        String[] parts;

        if (relationName != null){
            parts = trimmedLine.split("\\|\\|" + relationName + "\\|\\|");
        } else {
            parts = trimmedLine.split("\\|\\|");
        }

        String leftSide = parts[0].trim();
        String leftNodeAspect = checkAspect(leftSide);
        CheckNodes(leftSide, leftNodeAspect);

        String rightSide = parts[1].trim();
        String rightNodeAspect = checkAspect(rightSide);
        CheckNodes(rightSide, rightNodeAspect);


        //Placeholder
        RelationChecker(leftSide, leftNodeAspect, rightSide, rightNodeAspect, relationName);
    }

    private void CheckForTopNode(String trimmedLine) {
        if (trimmedLine.startsWith("<") && trimmedLine.endsWith(">")) {
            String topNodeName = trimmedLine.substring(1, trimmedLine.length() - 1);
            CreateTopNode(topNodeName);
            topNodeDeclared = true;
        } else {
            throw new IllegalArgumentException("Top node declaration is missing or malformed: " + trimmedLine);
        }
    }
    // Midlertidig test av parser
    // printer ut navn av toppnode.
    private void CreateTopNode(String topNodeName) {
        System.out.println("Creating top node " + topNodeName);
    }

    // Check aspect from first symbol
    private String checkAspect(String line) {

        char first = line.charAt(0);

        return switch (first) {
            case '-' -> "Produktaspektet";
            case '=' -> "funksjonsaspektet";
            case '%' -> "typeaspektet";
            case '$' -> "arbeidsprossessaspektet";
            default -> throw new RuntimeException("Invalid aspect symbol.");
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