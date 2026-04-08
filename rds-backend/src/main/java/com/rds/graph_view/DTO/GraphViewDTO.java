package com.rds.graph_view.DTO;

import java.util.*;

public class GraphViewDTO {
    /* Data transfer object for dataset (view) to hide non-required information in backend */
    public Map<String, List<NodeDTO>> aspects = new HashMap<>();
    public Set<RelationDTO> relationDTOS = new HashSet<>();

    public GraphViewDTO(Map<String, List<NodeDTO>> aspectLists, Set<RelationDTO> relationDTOS) {
        this.aspects = aspectLists;
        this.relationDTOS = relationDTOS;
    }

    public Map<String, List<NodeDTO>> getAspects() {
        return aspects;
    }

    public Set<RelationDTO> getRelations() {
        return relationDTOS;
    }
}
