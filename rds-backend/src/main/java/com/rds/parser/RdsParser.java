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
        //Pattern pattern = Pattern.compile("\\|\\||\\|[^|]+\\||/");

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
                nmbrCommented ++;  // Statistic counter
                continue;
            }

            // Check for top node declaration
            try{
            if (!topNodeDeclared) {CheckForTopNode(trimmedLine,graphManager);}

            else {
                List<RelationMatch> relations = findRelations(trimmedLine);
                    
                    //if matcher.find() does find relations it will send data of the two nodes and the relation between them for processing.
                    if (!relations.isEmpty()) {
                        System.out.print("detected cross relations\n\tInput: " + line + "\n");

                        String previousNodePart = null;

                        for (int i = 0; i < relations.size(); i++) {
                            RelationMatch relationMatch = relations.get(i);
                            String relation = relationMatch.relation;
                            System.out.println("Matched relation: " + relation);

                            System.out.print(
                                    "\n\t•Relation #" + (i + 1) + ": "
                            );
                            
                            // Get relation start and end postion
                            int start = relationMatch.start;
                            int end = relationMatch.end;
                            

                            // ======== LEFT SIDE ========
                            String leftPart; // Current left node in the relation

                            // if left node is null -> Start from the beginning og the line
                            if (previousNodePart == null) {
                                leftPart = trimmedLine.substring(0, start).trim();
                            } else {
                                leftPart = previousNodePart;
                            }
                            

                            // ======== RIGHT SIDE ========
                            int nextStart; // Left side of relation next

                            // Check edge case
                            if (i + 1 < relations.size()) {
                                nextStart = relations.get(i + 1).start;
                            } else {
                                nextStart = trimmedLine.length();
                            }

                            
                            
                            String rightPart = trimmedLine.substring(end, nextStart).trim(); // Extract right node
                            
                            System.out.println(leftPart + "' '" + relation + "' '" + rightPart + "'");

                            // store for next iteration
                            previousNodePart = rightPart;
                            

                            // PROCESS relation
                            System.out.println("\t>>'parse' calling 'CheckExplicitRelationForName'...");
                            System.out.println("\tNYYY:: Input for ^^ er: \n("+leftPart+", "+rightPart+", "+relation+")");
                            String relType = CheckExplicitRelationForName(leftPart, rightPart, relation, graphManager);
                            
                            //process leftsidde
                            String leftNodeAspect = checkAspect(leftPart);
                            String leftNodeLine = leftPart.substring(leftNodeAspect.length()).trim(); //remove aspect from code
                            String leftId = CheckNodes(leftNodeLine, leftNodeAspect, graphManager);

                            
                            // process rightSide
                            String rightNodeAspect = checkAspect(rightPart);
                            String rightNodeLine = rightPart.substring(rightNodeAspect.length()).trim(); //remove aspect from code                                                        
                            String rightId = CheckNodes(rightNodeLine, rightNodeAspect, graphManager);


                            //Creates explicit relation
                            RelationChecker(leftId, leftNodeAspect, rightId, rightNodeAspect, relType, graphManager);
                        
                        
                        }

                        System.out.println("––– Line #" + lineNumber + " completed –––\n");
                    }

                    // Node line (no relaton)
                    else{                    
                        // check for aspect and extract aspect symbol
                        String aspect = checkAspect(trimmedLine);
                        System.out.println("length of aspect: " + aspect.length());
                        trimmedLine = trimmedLine.substring(aspect.length()).trim(); //remove aspect from code

                        // Normal RDS line
                        System.out.println("Aspect: "+aspect);
                        System.out.println("detected node: " + trimmedLine + "\n\t>>'parse' calling 'CheckNodes'");
                        CheckNodes(trimmedLine, aspect, graphManager);

                    }
                }
            } catch (Exception e) {
                System.out.println("<Parser> Error  line " + lineNumber + ": " + e.getMessage());
                throw new com.rds.exceptions.ParseException(
                        "Error in input line "+ lineNumber + " '"+line+"'\n" +e.getMessage(), lineNumber
                );
            }
        
        }

        System.out.println("Number of commented out lines: "+nmbrCommented);
        return graphManager;
        
        }
    /*
     * Represents one explicit relation found in a line.
     *
     * Example:
     *
     * =A1/=B1
     *
     * relation = "/"
     * start    = position of "/"
     * end      = position immediately after "/"
     */
    private static class RelationMatch {

        private final int start;
        private final int end;
        private final String relation;


        private RelationMatch(
                int start,
                int end,
                String relation
        ) {

            this.start = start;
            this.end = end;
            this.relation = relation;
        }
    }



    /*
     * Finds explicit relations in a line.
     *
     * Supported relations:
     *
     * /
     * ||
     * |Type|
     *
     *
     * IMPORTANT:
     *
     * Relations are only detected when parenthesisDepth == 0.
     *
     * Therefore:
     *
     * =A1(test/name)
     *
     * "/" is ordinary text.
     *
     *
     * =A1(test/name)/=B1
     *
     * the second "/" is a relation.
     */
    private List<RelationMatch> findRelations(String line) {

        List<RelationMatch> relations =
                new ArrayList<>();


        int parenthesisDepth = 0;


        for (int i = 0; i < line.length(); i++) {

            char c = line.charAt(i);


            // -----------------------------------------
            // ENTER NAME
            // -----------------------------------------

            if (c == '(') {

                parenthesisDepth++;

                continue;
            }


            // -----------------------------------------
            // EXIT NAME
            // -----------------------------------------

            if (c == ')') {

                parenthesisDepth--;

                if (parenthesisDepth < 0) {

                    throw new ParseException(
                            "Unexpected closing parenthesis ')'"
                    );
                }

                continue;
            }


            // -----------------------------------------
            // IGNORE EVERYTHING INSIDE NAME
            // -----------------------------------------

            if (parenthesisDepth > 0) {
                continue;
            }


            // -----------------------------------------
            // RELATION: ||
            // -----------------------------------------

            if (line.startsWith("||", i)) {

                relations.add(
                        new RelationMatch(
                                i,
                                i + 2,
                                "||"
                        )
                );


                // Skip second |
                i++;

                continue;
            }


            // -----------------------------------------
            // RELATION: /
            // -----------------------------------------

            if (c == '/') {

                relations.add(
                        new RelationMatch(
                                i,
                                i + 1,
                                "/"
                        )
                );

                continue;
            }


            // -----------------------------------------
            // RELATION: |Type|
            // -----------------------------------------

            if (c == '|') {

                int endIndex =
                        findClosingRelationBar(
                                line,
                                i + 1
                        );


                if (endIndex == -1) {

                    throw new ParseException(
                            "Missing closing '|' for relation"
                    );
                }


                String relation =
                        line.substring(
                                i,
                                endIndex + 1
                        );


                relations.add(
                        new RelationMatch(
                                i,
                                endIndex + 1,
                                relation
                        )
                );


                // Skip entire relation
                i = endIndex;
            }
        }


        // Check that all parentheses were closed
        if (parenthesisDepth != 0) {

            throw new ParseException(
                    "Missing closing parenthesis ')'"
            );
        }


        return relations;
    }



    /*
     * Finds the closing | for a named relation.
     *
     * Example:
     *
     * |ConnectedTo|
     *
     * The first "|" has already been found.
     */
    private int findClosingRelationBar(
            String line,
            int startIndex
    ) {

        for (
                int i = startIndex;
                i < line.length();
                i++
        ) {

            if (line.charAt(i) == '|') {

                return i;
            }
        }


        return -1;
    }


    //processs a RDS line.
    //build a full id  for each node and creats  relation between them 

    private String CheckNodes(String trimmedLine, String aspect, GraphManager graphManager) {
        String[] nodes = splitNodes(trimmedLine, aspect);
        System.out.println("LIST OF NODES: " + Arrays.toString(nodes));

        String previousFullId = null; // keeps truck of previous id
        String currentFullId=""; //keeps truck of the id being built

        // for each node in line, check if it has a name // TO BE REMOVED: and then check the relationship between them
        for (String node : nodes){
            String name = null;

            // If node has a name
            if (node.contains("(")) {
                int startIndex = node.indexOf("(");
                int endIndex = findMatchingParenthesis(node, startIndex);

                // If number of parenthesis add up (found last parenthesis) – build string
                if (endIndex >= 0) {
                    // Build full ID
                    if (!currentFullId.isEmpty()) {
                        currentFullId = currentFullId + "." + node.substring(0, startIndex).trim();
                    } else {
                        currentFullId = aspect + node.substring(0, startIndex).trim();
                    }

                    // Extract complete name
                    name = node.substring(startIndex + 1, endIndex);

                    currentFullId = currentFullId.toUpperCase();

                    System.out.println(
                        "\n\t✓Name detected: '" + name + "' for: " + currentFullId
                    );
                }
                else{
                    throw new ParseException("Missing closing parenthesis ')' – numbers of parenthesis do not match");
                }
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
            currentFullId = currentFullId.toUpperCase();  // Kun for printens skyld
            System.out.println("\t>>'CheckNodes' calling 'createOrUpdateNode'("+currentFullId+", "+aspect+", "+name+")");
            graphManager.createOrUpdateNode(currentFullId, aspect, name);
        }
        return currentFullId;

    }

    private int findMatchingParenthesis(String text, int startIndex) {
    int depth = 0;

    for (int i = startIndex; i < text.length(); i++) {
        char c = text.charAt(i);

        if (c == '(') {
            depth++;
        } 
        else if (c == ')') {
            depth--;

            if (depth == 0) {
                return i;
            }
        }
    }

    // No matching closing parenthesis
    return -1;
}


    private String[] splitNodes(String line, String aspect) {
    /* New linesplitting parser, to handle aspects in names (name=), so they do not create a separate node 
    * Purpose: splits aa.bb.cc into nodes [aa, bb, cc]
    * Flow:
    For each character in line 'c'
    - Check if in name -> increase 'isParenthesis'. if mulitple embedded parantheses, equal number of ')' needed to reach 0
    - Check for . and aspect IF isParenthesis == 0 -> meaning not in  a parenthesis
    - 
    */
    List<String> nodes = new ArrayList<>();

    StringBuilder current = new StringBuilder();
    int isParentheses = 0;

    for (int i = 0; i < line.length(); i++) {
        char c = line.charAt(i);

        // Start/end name ()
        if (c == '(') {
            isParentheses++;
            current.append(c);
        }
        else if (c == ')') {
            isParentheses--;
            current.append(c);
        }

        // Separate node by "." or aspect, if not in a parenthesis
        else if (isParentheses == 0 && (c == '.' || line.startsWith(aspect, i))) {        

            // Split by '.'
            if (current.length() > 0) {
                nodes.add(current.toString());
                current.setLength(0);
            }

            // Split by aspect symbol(s)
            if (line.startsWith(aspect, i)) {
                i += aspect.length() - 1;
            }
        }

        //Appends character to current node level (eg. y to b for 'ax.by.cx' | w to by(t for ax.by(two))
        else {
            current.append(c); // append to node level referance
        }
    }

    // Add last node to nodes
    if (current.length() > 0) {
        nodes.add(current.toString());
    }

    return nodes.toArray(new String[0]);
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
    

    private String CheckExplicitRelationForName(String leftSide, String rightSide, String relation, GraphManager graphmanger) {
        String relationName = null;
        if (!relation.equals("||") && !relation.equals("/")) {
            relationName = relation.substring(1, relation.length() - 1);
            System.out.println("\t✓Relation name detected: "+relationName);
            return relationName;
        }
        else {
            System.out.println("\t\t×No relation name detected: " + relationName);
        }
        return "";
    
        
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
        System.out.println("<PARSER> reached checkAspect. Input is: \n"+line);

        // Sort aspectlist, to check for "%%" before "%"
        aspectList.sort((a, b) -> Integer.compare(b.length(), a.length()));


        for(String asp : aspectList){
            System.out.println("(CheckAsp): "+asp);
            if (line.startsWith(asp))return asp;
        }
        throw new ParseException("No valid aspect detected");  // input line number
        
    }    

}