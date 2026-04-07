package com.rds;

import com.rds.datastructure.GraphManager;
import com.rds.graph_view.ViewBuilder;
import com.rds.parser.RdsParser;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RdsController {

    @PostMapping(value = "/parse", consumes = "text/plain")
    public ViewBuilder parseRds(@RequestBody String rdsScript) {

        // Parse script and create datastructure
        RdsParser parser = new RdsParser();
        GraphManager graph = parser.parse(rdsScript);
        graph.finalizeGraph();  // Connects root to aspects

        // Create a graphView for frontend (selected data)
        ViewBuilder graphView = new ViewBuilder();
        graphView.buildView(graph);  // builds view

        return graphView;
    }
}