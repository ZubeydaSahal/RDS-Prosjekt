package com.rds.example;
import java.util.List;

    public class GraphResponse {

        private List<GraphNode> nodes;
        private List<GraphRelation> relations;

        public GraphResponse(List<GraphNode> nodes, List<GraphRelation> relations) {
            this.nodes = nodes;
            this.relations = relations;
        }

        public List<GraphNode> getNodes() {
            return nodes;
        }

        public List<GraphRelation> getRelations() {
            return relations;
        }
    }
