package com.rds.graph_view.DTO;

import com.rds.datastructure.Relation;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class GraphViewDTO {
    /*
    * Class to format the data for frontend, as well as hide unused data-information
    * */
    public Map<String, List<NodeDTO>> aspects;
    public Set<Relation> relations;

    public GraphViewDTO(Map<String, List<NodeDTO>> aspectLists, Set<Relation> relations) {
        this.aspects = aspectLists;
        this.relations = relations;
    }

    public Map<String, List<NodeDTO>> getAspects() {
        return aspects;
    }

    public Set<Relation> getRelations() {
        return relations;
    }
}
