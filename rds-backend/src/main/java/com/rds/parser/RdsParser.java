//<<<<<<<< HEAD:backend/Parser/RdsParser.java

package com.rds.parser;

import com.rds.datastructure.GraphManager;
import com.rds.exceptions.ParseException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


//the function NodeChecker and RelationChecker are placeholders.
public class RdsParser {
    private boolean topNodeDeclared = false;
    private List<String> aspectList = new ArrayList<>();

    // receives the whole script as a string, splits it into lines and processes each line according to the RDS syntax rules.
    public GraphManager parse(String script, List<String>aspects){
        aspectList = aspects;
        GraphManager graphManager = new GraphManager();
        System.out.println("<Parse> Script: \n" + script + "\n");
        String[] lines = script.split("\\r?\\n");
        int lineNumber = 0;
        Pattern pattern = Pattern.compile("\\|\\||\\|[^|]+\\||/");

        // Counter for commented lines
        int nmbrCommented = 0;

        // 1. it checks if the topNode is declared or not in the first line
        // 2. checks the line for explicit relation being declared
        // 3. checks the line for which aspect the line belongs to, stores it, then removes the symbol.
        // 4. checks the line and calls function to create every node.
        for (String line : lines) {
            lineNumber++;
            String trimmedLine = line.trim();
            System.out.print("\n<Parse> Line " + lineNumber + ": ");
            if (trimmedLine.isEmpty()) continue;
            if (line.startsWith("\\")) {
                nmbrCommented ++;
                continue;
            }

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
                    //if matcher.find() do find relations it will send data of the two nodes and the relation between them for processing.
                    if (!relations.isEmpty()) {
                        String previousNodePart = null; // Might be redundant
                        System.out.print("detected cross relations\n\tInput: " + line + "\n");

                        for (int i = 0; i < relations.size(); i++) {
                            String relation = relations.get(i);
                            System.out.println("Matched relation: " + relation);
                            System.out.print("\n\t•Relation #" + (i + 1) + ": ");

                            // Get relation start and end postion
                            int start = relationPositions.get(i)[0];
                            int end = relationPositions.get(i)[1];

                            // LEFT SIDE
                            String leftPart; // Current left node in the relation

                            // if left node is null -> Start from the beginning og the line
                            if (previousNodePart == null) {
                                leftPart = trimmedLine.substring(0, start).trim();
                            } else {
                                leftPart = previousNodePart;
                            }

                            // RIGHT SIDE
                            int nextStart; // Left side of relation next

                            // Check edge case
                            if (i + 1 < relations.size()) {
                                nextStart = relationPositions.get(i + 1)[0];
                            } else {
                                nextStart = trimmedLine.length();
                            }

                            String rightPart = trimmedLine.substring(end, nextStart).trim(); // Extract right node
                            System.out.println(leftPart + "' '" + relation + "' '" + rightPart + "'");

                            // store for next iteration
                            previousNodePart = rightPart;

                            // PROCESS relation
                            System.out.println("\t>>'parse' calling 'CheckExplicitRelationForName'...");
                            CheckExplicitRelationForName(leftPart, rightPart, relation, graphManager);
                        }
                        System.out.println("––– Line #" + lineNumber + " completed –––\n");
                    }

                    // IF line declares a node, not a relation
                    if (!foundRelation) {
                        // check for aspect and remove aspect symbol
                        String aspect = checkAspect(trimmedLine);
                        // endring: fjerner aspect.length() tegn i stedet for alltid 1
                        System.out.println("length of aspect: " + aspect.length());
                        trimmedLine = trimmedLine.substring(aspect.length()).trim();

                        // Normal RDS line
                        System.out.println("Aspect: "+aspect);
                        System.out.println("detected node: " + trimmedLine + "\n\t>>'parse' calling 'CheckNodes'");
                        CheckNodes(trimmedLine, aspect, graphManager);

                    }
                }
            } catch (Exception e) {
                System.out.println("<Parser> Error  line " + lineNumber + ": " + e.getMessage());
                throw new com.rds.exceptions.ParseException(
                        "Error in input line: "+ lineNumber + ": "+e.getMessage(), lineNumber
                );
            }
        
        }

        System.out.println("Number of commented out lines: "+nmbrCommented);
        return graphManager;
        
        }

    
    //processs a RDS line.
    //build a full id  for each node and creats  relation between them 

    private void CheckNodes(String trimmedLine, String aspect, GraphManager graphManager) {
        // String[] nodes = trimmedLine.split("\\.|(?=" + aspect + ")");
        String escapedAspect = escapeRegex(aspect);
        String[] nodes = trimmedLine.split("\\.|" + escapedAspect);
        System.out.println("LIST OF NODES: " + Arrays.toString(nodes));
        String previousFullId = null; // keeps truck of previous id
        String currentFullId=""; //keeps truck of the id being built

        // for each node in line, check if it has a name // TO BE REMOVED: and then check the relationship between them
        for (String node : nodes){
            String id;
            String name = null;

            // Check node for name
            if (node.contains("(") && node.contains(")")) {
                int startIndex = node.indexOf("(");
                int endIndex = node.indexOf(")");

                // Extract id and name and update
                // endring: lagt til aspect + på første node
                if(!currentFullId.isEmpty()) {
                    currentFullId = currentFullId + "." + node.substring(0, startIndex).trim();
                }else {
                    currentFullId = aspect + node.substring(0, startIndex).trim();
                }

                name = node.substring(startIndex + 1, endIndex);
                System.out.println("\n\t✓Name detected: '"+ name+"' for: "+ currentFullId);
            }
            // Else create node without name
            else {
                if(!currentFullId.isEmpty()){
                    currentFullId = currentFullId + "." + node.trim();
                } else {
                    //endring: lagt til aspect + på første node
                    currentFullId = aspect + node;
                }
                System.out.println("\n\t×No name detected for: "+currentFullId);
            }
            System.out.println("\t>>'CheckNodes' calling 'createOrUpdateNode'("+currentFullId+", "+aspect+", "+name+")");
            graphManager.createOrUpdateNode(currentFullId, aspect, name);
        }
            // ––––––––––––––––




/*
            // -- Sean removed 9.4 12.00 - GraphManager handles non-existing parents
            if(currentFullId.isEmpty()){
                currentFullId = aspect + id;
            } else {
                currentFullId = currentFullId + "." + id;
            }

            NodeChecker(currentFullId, aspect, name, graphManager); //creats or update node in graph manager

            // implicit relationship between nodes
            if (previousFullId != null){
                RelationChecker(previousFullId, aspect, currentFullId, aspect, "hierarchy", graphManager);
                System.out.println("1. Implicit create relation child: "+currentFullId + " og parent: "+ previousFullId);
            }
            previousFullId = currentFullId; //update previousid
            */
        }

    //creats relation bewteen nodes in graphmanger
    //creats nodes only when nodes exist
    private void RelationChecker(String fromId, String aspectFrom, String toId, String aspectTo, String type, GraphManager graphManager) {
        System.out.println("\t>> 'ReltionChecker' calling 'GraphManager.createRelation': ("+fromId+", "+  aspectFrom+", " +
                toId+", "+  aspectTo+", "+  type+", graphManager)");
        graphManager.createRelation(fromId, aspectFrom, toId, aspectTo, type);
}

    //creats or update node in graphmanger. 
    private void NodeChecker(String fullId, String aspect, String name, GraphManager graphManager) {
        System.out.println("this is its full id: " + fullId);
        graphManager.createOrUpdateNode(fullId, aspect, name);
    }
    

    private void CheckExplicitRelationForName(String leftSide, String rightSide, String relation, GraphManager graphmanger) {
        String relationName = null;
        if (!relation.equals("||") && !relation.equals("/")) {
            relationName = relation.substring(1, relation.length() - 1);
            System.out.println("\t✓Relation name detected: "+relationName);
        }
        else {
            System.out.println("\t\t×No relation name detected: " + relationName);
        }
        //process leftsidde (remove aspect)
        String leftNodeAspect = checkAspect(leftSide);
        // endring: fjerner aspect.length() tegn i stedet for alltid 1
        leftSide = leftSide.substring(leftNodeAspect.length()).trim();
        //CheckNodes(leftSide, leftNodeAspect,graphmanger);  // Temp, kode: FDFDF

        // process rightSide
        String rightNodeAspect = checkAspect(rightSide);
        // endring: fjerner aspect.length() tegn i stedet for alltid 1
        rightSide = rightSide.substring(rightNodeAspect.length()).trim();
        //CheckNodes(rightSide, rightNodeAspect, graphmanger); //Temp, kode: FDFDF

        //gets last node from each side of a explicit relation
        //String leftLastId = leftNodeAspect + leftSide.split("\\.")[leftSide.split("\\.").length-1];
        //String rightLastId = rightNodeAspect + rightSide.split("\\.")[rightSide.split("\\.").length-1];

        //Creats explicit relation
        RelationChecker(leftNodeAspect + leftSide, leftNodeAspect, rightNodeAspect + rightSide, rightNodeAspect, relationName, graphmanger);
        
    }
    private String escapeRegex(String str){
        return Pattern.quote(str);
    }

    private void CheckForTopNode(String trimmedLine, GraphManager graphManager) {
        if (trimmedLine.startsWith("<") && trimmedLine.endsWith(">")) {
            String topNodeName = trimmedLine.substring(1, trimmedLine.length() - 1);
            CreateTopNode(topNodeName, graphManager);
            topNodeDeclared = true;
        } else {
            throw new IllegalArgumentException("Top node declaration is missing or malformed: " + trimmedLine+"\n");
        }
    }
    // Midlertidig test av parser

    // printer ut navn av toppnode.
    private void CreateTopNode(String topNodeName, GraphManager graphManager) {
        System.out.print("detected root: " + topNodeName+"\n");
        graphManager.setRoot(topNodeName);
    }

    // Check aspect from first symbol
    private String checkAspect(String line) {
        System.out.println("REACHed checkAspect");

        // Sort aspectlist, to check for "%%" before "%"
        aspectList.sort((a, b) -> Integer.compare(b.length(), a.length()));


        for(String asp : aspectList){
            System.out.println("(CheckAsp): "+asp);
            if (line.startsWith(asp))return asp;
        }
        throw new ParseException("No valid aspect detected, input: "+line);  // input line number
        //throw new IllegalArgumentException("invalid aspect symbol or missing aspect symbol: " + line);


        /* Replaced with config
        if (line.startsWith("%%")) return "%%";
        else if (line.startsWith("#")) return "#";
        else if (line.startsWith("-")) return "-";
        else if (line.startsWith("=")) return "=";
        else if (line.startsWith("%")) return "%";
        else if (line.startsWith("$")) return "$";*/


        //char first = line.charAt(0);

//        return switch () {
//            case '-' -> "-";
//            case '=' -> "=";
//            case '%' -> "%";
//            case '$' -> "$";
//            default -> throw new RuntimeException("Invalid aspect symbol. " + line );
//        };
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