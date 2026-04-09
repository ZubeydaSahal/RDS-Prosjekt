//<<<<<<<< HEAD:backend/Parser/RdsParser.java

package com.rds.parser;

import com.rds.datastructure.GraphManager;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


//the function NodeChecker and RelationChecker are placeholders.
public class RdsParser {
    private boolean topNodeDeclared = false;

    // receives the whole script as a string, splits it into lines and processes each line according to the RDS syntax rules.
    public GraphManager parse(String script){
        GraphManager graphManager = new GraphManager();
        System.out.println(script);
        String[] lines = script.split("\\r?\\n");
        int lineNumber = 0;
        Pattern pattern = Pattern.compile("\\|\\||\\|[^|]+\\|");

        // 1. it checks if the topNode is declared or not in the first line
        // 2. checks the line for explicit relation being declared
        // 3. checks the line for which aspect the line belongs to, stores it, then removes the symbol.
        // 4. checks the line and calls function to create every node.
        for (String line : lines) {
            lineNumber++;
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty()) continue;

            // Check for top node declaration
            try{
            if (!topNodeDeclared) {CheckForTopNode(trimmedLine,graphManager);}
            else {
                // check for relationship
                Matcher matcher = pattern.matcher(trimmedLine);
                List<int[]> relationPositions = new ArrayList<>();
                List<String> relations = new ArrayList<>();
                boolean foundRelation = false;

                // goes through the line and find everywhere a relation occurs and stores the position of them
                while (matcher.find()) {
                    foundRelation = true;
                    relationPositions.add(new int[]{matcher.start(), matcher.end()});
                    relations.add(matcher.group());
                }
                //if matcher.find() do find relations it will send data of the two nodes and the relation betwen them for processing.
                if (!relations.isEmpty()) {
                    String previousNodePart = null;

                    for (int i = 0; i < relations.size(); i++) {
                        String relation = relations.get(i);

                        int start = relationPositions.get(i)[0];
                        int end = relationPositions.get(i)[1];

                        // LEFT SIDE
                        String leftPart;
                        if (previousNodePart == null) {
                            leftPart = trimmedLine.substring(0, start).trim();
                            System.out.println("When previous node is null: " + leftPart);
                        } else {
                            leftPart = previousNodePart;
                            System.out.println("When previous node is not null " + leftPart);
                        }

                        // RIGHT SIDE
                        int nextStart;
                        if (i + 1 < relations.size()) {
                            nextStart = relationPositions.get(i + 1)[0];
                        } else {
                            nextStart = trimmedLine.length();
                        }

                        String rightPart = trimmedLine.substring(end, nextStart).trim();
                        System.out.println("the rightpart of relation:  " + rightPart);

                        // store for next iteration
                        previousNodePart = rightPart;

                        // PROCESS relation
                        CheckExplicitRelationForName(leftPart, rightPart, relation, graphManager);
                    }
                }
                if (!foundRelation) {
                    // check for aspect and remove aspect symbol
                    String aspect = checkAspect(trimmedLine);
                    trimmedLine = trimmedLine.substring(1).trim();

                    // Normal RDS line
                    CheckNodes(trimmedLine, aspect, graphManager);
                    System.out.println(lineNumber);

                }
            }
        }catch (Exception e){
                System.out.println("Error  line " + lineNumber + ": " + e.getMessage());
            }
        
        }
        //graphManager.finalizeGraph();
        return graphManager;
        
        }

    
    //processs a RDS line.
    //build a full id  for each node and creats  relation between them 

    private void CheckNodes(String trimmedLine, String aspect, GraphManager graphManager) {
        String[] nodes = trimmedLine.split("\\.");
        String previousFullId = null; // keeps truck of previous id
        String currentFullId=""; //keeps truck of the id being built

        // Sean driver og debugger manglende foreldre


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


            // Nødvendig!
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
    

    private void CheckExplicitRelationForName(String leftSide, String rightSide, String relation, GraphManager graphmanger) {
        String relationName = null;

        if (!relation.equals("||")) {
            relationName = relation.substring(1, relation.length() - 1);
            System.out.println(relationName + " is the name of relation");
        }
        else {
            System.out.println("name of relation is null: " + relationName);
        }

        //process leftsidde
        String leftNodeAspect = checkAspect(leftSide);
        leftSide = leftSide.substring(1).trim(); // remove aspect symbol
        CheckNodes(leftSide, leftNodeAspect,graphmanger);

        // process rightSide
        String rightNodeAspect = checkAspect(rightSide);
        rightSide = rightSide.substring(1).trim(); // remove aspect symbol
        CheckNodes(rightSide, rightNodeAspect, graphmanger);

        //gets last node from each side of a explicit relation
        String leftLastId = leftNodeAspect + leftSide.split("\\.")[leftSide.split("\\.").length-1];
        String rightLastId = rightNodeAspect + rightSide.split("\\.")[rightSide.split("\\.").length-1];

        //Creats explicit relation
        RelationChecker(leftLastId, leftNodeAspect, rightLastId, rightNodeAspect, relationName, graphmanger);
        
    }

    private void CheckForTopNode(String trimmedLine, GraphManager graphManager) {
        if (trimmedLine.startsWith("<") && trimmedLine.endsWith(">")) {
            String topNodeName = trimmedLine.substring(1, trimmedLine.length() - 1);
            CreateTopNode(topNodeName, graphManager);
            System.out.println("<Parser> Creating toppnode "); // Sean debugger
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
    /*private String checkExplicitRelationName(String line) {
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
     */

}