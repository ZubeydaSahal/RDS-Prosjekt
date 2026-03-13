import ReactFlow from "reactflow";
import { graphToFlow } from "../graphToFlow.js";

export default function GraphView({ graph }) {

  const { flowNodes, flowRelations } = graphToFlow(graph);

  return (
      <div style={{ width: "100%", height: "600px" }}>
        <ReactFlow
            nodes={flowNodes}
            edges={flowRelations}
        />
      </div>
  );
}