package com.rds;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rds.datastructure.GraphManager;
import com.rds.graph_view.ViewBuilder;
import com.rds.parser.RdsParser;
import com.rds.datastructure.Relation;

import java.util.*;

import com.rds.graph_view.DTO.*;
import com.rds.datastructure.GraphTest;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RdsController {

    @PostMapping(value = "/parse", consumes = "text/plain", produces = "application/json")
    public GraphViewDTO parseRds(@RequestBody String rdsScript,
                                 @RequestParam(required = false) Map<String, String> allParams,
                                @RequestParam(required = false) String allAspects) throws JsonProcessingException {



        System.out.println("(controller) All aspects: " +allAspects);

        // Convert allAspect to List
        ObjectMapper mapper = new ObjectMapper();
        List<String> aspectList = Arrays.asList(
                mapper.readValue(allAspects, String[].class)
        );




        // Parse script and create datastructure 'GraphManager' instance
        RdsParser parser = new RdsParser();
        GraphManager graph = parser.parse(rdsScript, aspectList);
        graph.finalizeGraph();  // Connects root to aspects

        // Build filter maps from query parameters
        Map<String, Boolean> aspectFilters = buildFilter(allParams, "aspect_");
        Map<String, Boolean> relationFilters = buildFilter(allParams, "rel_");

        // Create a list of active aspects
        List<String> activeAspects = getActiveAspects(aspectFilters);
        System.out.println("3 (Controller)Aspects: ");
        for (String a : activeAspects) {
            System.out.println(a+", ");
        }

        // Create a view of the data for frontend (selected data)
        ViewBuilder viewBuilder = new ViewBuilder();
        GraphViewDTO graphViewDTO = viewBuilder.buildView(graph, aspectFilters, relationFilters);


        return graphViewDTO;

        /*// Test datastructure SEAN
        GraphTest graphTest = new GraphTest();
        GraphViewDTO gv = graphTest.testController();
        return gv;*/
    }

    //Extracts filters from query parameters based on a given prefix (e.g., "aspect_" or "rel_")
    private Map<String, Boolean> buildFilter(Map<String, String> params, String prefix) {
        if (params == null) return null;

        Map<String, Boolean> filter = new HashMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getKey().startsWith(prefix)) {
                System.out.println("Started with pref: "+ prefix);
                String raw = entry.getKey().substring(prefix.length());

                // Decode the URL sake keys back to aspect symbold
                // PCTPCT must be decoded before PCT to avoid conflicts
                System.out.println("Raw: " +raw);
                String key = raw;
                        /*.replace("PCTPCT", "%%")
                        .replace("PCT", "%")
                        .replace("EQ", "=")
                        .replace("DASH", "-");*/
                System.out.println("Key: "+key);
                filter.put(key, Boolean.parseBoolean(entry.getValue()));
            }
        }
        return filter.isEmpty() ? null : filter;
    }
    // Get aspects
    private List<String> getActiveAspects(Map<String, Boolean> aspectFilters) {

        List<String> activeAspects = new ArrayList<>();
        if (aspectFilters != null) {
            for (Map.Entry<String, Boolean> entry : aspectFilters.entrySet()) {
                if (entry.getValue()) {  // If aspect is active (true)
                    activeAspects.add(entry.getKey());
                }
            }
        }
        System.out.println("5 (Controlller)Active aspects (before return) "+activeAspects);
        return activeAspects;
    }

}




