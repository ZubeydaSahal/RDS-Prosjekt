package com.rds.graph_view.DTO;

// ===== Libraries =====
import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;
import java.util.List;



public class GraphViewDTO {
    /* Data transfer object for dataset (view) to hide non-required information in backend */

    // ===== Attributes =====
    private Map<String, List<NodeDTO>> nodeDTO = new HashMap<>();
    private Set<RelationDTO> relationDTOS = new HashSet<>();

    // ===== Constructor =====
    public GraphViewDTO(Map<String, List<NodeDTO>> aspectLists, Set<RelationDTO> relationDTOS) {
        this.nodeDTO = aspectLists;
        this.relationDTOS = relationDTOS;
    }

    // ===== Getters =====
    public Map<String, List<NodeDTO>> getNodeDTO() {
        return nodeDTO;
    }

    public Set<RelationDTO> getRelationDTO() {
        return relationDTOS;
    }
}
