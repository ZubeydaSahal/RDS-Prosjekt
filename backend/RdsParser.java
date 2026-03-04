import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
/*
// the function NodeChecker and RelationChecker are placeholders.
public class RdsParser {
    private boolean topNodeDeclared = false;

    // receives the whole script as a string, splits it into lines and processes each line according to the RDS syntax rules.
    public void parse(String script){
    
        String[] lines = script.split("\\r?\\n");
        int lineNumber = 0;

        // 1. it checks if the topNode is declared or not in the first line
        // 2. checks the line for explicit relation being declared
        // 3. checks the line for which aspect the line belongs to, stores it, then removes the symbol.
        // 4. 
        for (String line : lines) {
            lineNumber++;
            String trimmedLine = line.trim();

            if (trimmedLine.isEmpty()) continue;


            // Check for top node declaration
            if (!topNodeDeclared && lineNumber != 1){
                if (trimmedLine.startsWith("<") && trimmedLine.endsWith(">")) {
                    String topNodeName = trimmedLine.substring(1, trimmedLine.length() - 1);
                    CreateTopNode(topNodeName);
                    topNodeDeclared = true;
                    continue;
                } else {
                    throw new IllegalArgumentException("Top node declaration is missing or malformed: " + line);
            }
            }

            // check for explicit relationship
            if (line.contains("||")){
                String relationName = checkExplicitRelationName(line);
                String[] parts;

                if (relationName != null){
                    parts = line.split("\\|\\|" + relationName + "\\|\\|");
                } else {
                    parts = line.split("\\|\\|");
                }

                String leftSide = parts[0].trim();
                String rightSide = parts[1].trim();

                // NB! their aspect symbols are also sent here.
                String leftNode = getLastNode(leftSide);
                String rightNode = getLastNode(rightSide);

                RelationChecker(leftNode, rightNode, relationName);
                continue;
            }

            // check for aspect and remove aspect symbol
            String aspect = checkAspect(trimmedLine);
            line = trimmedLine.substring(1).trim();
            
            // Normal RDS line
            String[] nodes = line.split("\\.");
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
                NodeChecker(id, name, aspect);

                // implicit relationship between nodes
                if (previousNode != null){
                    RelationChecker(previousNode, id, null);
                }
                previousNode = id;
            }

        }
    }
    // Check aspect from first symbol
    private String checkAspect(String line) {

        char first = line.charAt(0);

        switch (first) {
            case '-':
                return "Produktaspektet";
            case '=':
                return "funksjonsaspektet";
            case '%':
                return "typeaspektet";
            case '$':
                return "arbeidsprossessaspektet";
            default:
                throw new RuntimeException("Invalid aspect symbol.");
        }
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
*/
