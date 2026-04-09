package com.rds;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rds.datastructure.GraphManager;
import com.rds.graph_view.ViewBuilder;
import com.rds.parser.RdsParser;
import com.rds.graph_view.DTO.*;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RdsController {

    @PostMapping(value = "/parse", consumes = "text/plain", produces = "application/json")
    public GraphViewDTO parseRds(@RequestBody String rdsScript,
                                  @RequestParam(required = false) Map<String, String> allParams) {

        // Parse script and create datastructure 'GraphManager' instance
        RdsParser parser = new RdsParser();
        GraphManager graph = parser.parse(rdsScript);
        graph.finalizeGraph();  // Connects root to aspects


        // Bygg filter-maps fra query params
        Map<String, Boolean> aspectFilters = buildFilter(allParams, "aspect_");
        Map<String, Boolean> relationFilters = buildFilter(allParams, "rel_");

        // Create a view of the data for frontend (selected data)
        ViewBuilder viewBuilder = new ViewBuilder();
        GraphViewDTO graphViewDTO = viewBuilder.buildView(graph, aspectFilters, relationFilters);

        // Debugging
        //Debugging
        System.out.println("+X+X+X Debugging X+X+X+");
        System.out.println("Aspects: "+graphViewDTO.getNodeDTO());
        System.out.println("Relations: "+graphViewDTO.getRelationDTO());
        //System.out.println("GetRelations: "+graphViewDTO.getRelations());

        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(graphViewDTO);
            System.out.println("JSON: "+json);
        }catch (JsonProcessingException e){
            e.printStackTrace();
        }

        return graphViewDTO;

        /*// Test datastructure SEAN
        GraphTest graphTest = new GraphTest();
        GraphViewDTO gv = graphTest.testController();
        return gv;*/
    }

    private Map<String, Boolean> buildFilter(Map<String, String> params, String prefix) {
        if (params == null) return null;

        Map<String, Boolean> filter = new HashMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getKey().startsWith(prefix)) {
                String key = entry.getKey().substring(prefix.length());
                filter.put(key, Boolean.parseBoolean(entry.getValue()));
            }
        }
        return filter.isEmpty() ? null : filter;
    }

}
