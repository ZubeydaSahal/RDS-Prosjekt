import GraphView from "./components/GraphView";
import InputPanel from "./components/InputPanel.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import FilterDropdown from "./components/FilterDropdown";          
import { mockGraph } from "./components/MockGraph";

import { useState, useRef } from "react";

function App() {

  // ----------------------------
  // ASPEKT-REKKEFØLGE (MASTER STATE)
  // ----------------------------
  const [aspectOrder, setAspectOrder] = useState(["=", "%", "-", "%%"]);

  // ----------------------------
  // FILTER
  // ----------------------------
  const [activeAspect, setActiveAspect] = useState(["=", "%", "-", "%%"]);
  const [activeRelation, setActiveRelation] = useState(["cross", "hierarchy"]);
  const [rdsText, setRdsText] = useState("");

  const graphRef = useRef(null);

  // ----------------------------
  // FLYTT ASPEKTER
  // ----------------------------
  function moveLeft(index) {
    if (index === 0) return;

    const newOrder = [...aspectOrder];
    [newOrder[index - 1], newOrder[index]] =
      [newOrder[index], newOrder[index - 1]];

    setAspectOrder(newOrder);
  }

  function moveRight(index) {
    if (index === aspectOrder.length - 1) return;

    const newOrder = [...aspectOrder];
    [newOrder[index], newOrder[index + 1]] =
      [newOrder[index + 1], newOrder[index]];

    setAspectOrder(newOrder);
  }

  // ----------------------------
  // GRAFDATA
  // ----------------------------
  const [backendGraph, setBackendGraph] = useState(null);
  const graph = backendGraph || mockGraph;

  return (
    <div>

      <Navbar />

      <div className="layout">

        {/* VENSTRE PANEL */}
        <div className="input-section">

          <InputPanel
            setGraph={setBackendGraph}
            graphRef={graphRef}
            activeAspect={activeAspect}
            activeRelation={activeRelation}
          />

          <FilterDropdown
            activeAspect={activeAspect}
            setActiveAspect={setActiveAspect}
            activeRelation={activeRelation}
            setActiveRelation={setActiveRelation}
            setRdsText={setRdsText}
          />

        </div>

        {/* HØYRE SIDE */}
        <div className="tree-section">
          <h2>Trestruktur</h2>

          {/* ENESTE STED MED KNAPPER */}
          <div className="aspect-controls">
            {aspectOrder.map((aspect, index) => (
              <div key={aspect} className="aspect-item">
                <span>{aspect}</span>
                <button onClick={() => moveLeft(index)}>←</button>
                <button onClick={() => moveRight(index)}>→</button>
              </div>
            ))}
          </div>

          {graph ? (
            <GraphView
              graph={graph}
              aspectOrder={aspectOrder}  
              graphRef={graphRef}
            />
          ) : (
            <p>Ingen graf lastet</p>
          )}

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default App;