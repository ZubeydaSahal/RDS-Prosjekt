package com.rds.graph_view.DTO;

import java.util.*;

public class GraphViewDTO {
    /* Data transfer object for dataset (view) to hide non-required information in backend */
    private Map<String, List<NodeDTO>> nodeDTO = new HashMap<>();
    private Set<RelationDTO> relationDTOS = new HashSet<>();

    public GraphViewDTO(Map<String, List<NodeDTO>> aspectLists, Set<RelationDTO> relationDTOS) {
        this.nodeDTO = aspectLists;
        this.relationDTOS = relationDTOS;
    }

    public Map<String, List<NodeDTO>> getNodeDTO() {
        return nodeDTO;
    }

    public Set<RelationDTO> getRelationDTO() {
        return relationDTOS;
    }
}
