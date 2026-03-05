import { useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

export default function GraphViewer() {

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const loadGraph = async () => {

        const response = await fetch("http://localhost:8080/graph");
        const data = await response.json();

        // transform backend nodes → react flow nodes
        const rfNodes = data.nodes.map((node, index) => ({
            id: node.id,
            data: { name: node.name },
            position: { x: index * 150, y: 100 }  // temporary positions
        }));

        // transform backend edges → react flow edges
        const rfEdges = data.relations.map((edge, index) => ({
            id: "e" + index,
            source: edge.source,
            target: edge.target,
            label: edge.label
        }));

        setNodes(rfNodes);
        setEdges(rfEdges);
    };

    return (
        <div>

            <button onClick={loadGraph}>
                Load Graph
            </button>

            <div style={{ width: "100%", height: "500px" }}>
                <ReactFlow nodes={nodes} edges={edges} />
            </div>

        </div>
    );
}