package com.rds;

import com.rds.datastructure.Filter;
import com.rds.datastructure.GraphManager;
import com.rds.datastructure.GraphTest;
import com.rds.datastructure.GraphTest.*;
import com.rds.graph_view.ViewBuilder;
import com.rds.parser.RdsParser;
import com.rds.datastructure.Relation;

import java.util.List;
import java.util.Map;
import java.util.Set;
import com.rds.graph_view.DTO.*;
import com.rds.datastructure.GraphTest;


import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RdsController {

    @PostMapping(value = "/parse", consumes = "text/plain", produces = "application/json")
    public GraphViewDTO parseRds(@RequestBody String rdsScript) {

        // Parse script and create datastructure
        RdsParser parser = new RdsParser();
        GraphManager graph = parser.parse(rdsScript);
        graph.finalizeGraph();  // Connects root to aspects

        // Create a graphView for frontend (selected data)
        ViewBuilder graphView = new ViewBuilder();
        graphView = graphView.buildView(graph);  // builds view


        return new GraphViewDTO(
                graphView.getNodesByApsect(),
                graphView.getCrossRelations()
        );


        /*// Test datastructure SEAN
        GraphTest graphTest = new GraphTest();
        GraphViewDTO gv = graphTest.testController();
        return gv;*/
    }
}