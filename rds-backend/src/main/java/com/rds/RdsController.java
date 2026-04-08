package com.rds;

import com.rds.datastructure.GraphManager;
import com.rds.graph_view.ViewBuilder;
import com.rds.parser.RdsParser;

import com.rds.graph_view.DTO.*;


import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RdsController {

    @PostMapping(value = "/parse", consumes = "text/plain", produces = "application/json")
    public GraphViewDTO parseRds(@RequestBody String rdsScript) {

        // Parse script and create datastructure 'GraphManager' instance
        RdsParser parser = new RdsParser();
        GraphManager graph = parser.parse(rdsScript);
        graph.finalizeGraph();  // Connects root to aspects

        // Create a view of the data for frontend (selected data)
        ViewBuilder viewBuilder = new ViewBuilder();
        GraphViewDTO graphViewDTO = viewBuilder.buildView(graph);  // builds view and return DTO
        return graphViewDTO;

        /*// Test datastructure SEAN
        GraphTest graphTest = new GraphTest();
        GraphViewDTO gv = graphTest.testController();
        return gv;*/
    }
}