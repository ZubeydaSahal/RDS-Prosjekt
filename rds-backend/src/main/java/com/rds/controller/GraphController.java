package com.rds.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.rds.example.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class GraphController {
    @GetMapping("/graph")
    public GraphResponse getGraph() {
        System.out.println("Graph");

        GraphNode A = new GraphNode("A", "Node A");
        GraphNode B = new GraphNode("B", "Node B");
        GraphNode C = new GraphNode("C", "Node C");

        GraphRelation AB = new GraphRelation("A", "B", "parent");
        GraphRelation AC = new GraphRelation("A", "C", "parent");

        System.out.println(AB.toString());
        return new GraphResponse(
                List.of(A, B, C),
                List.of(AB, AC)
        );
    }
}
