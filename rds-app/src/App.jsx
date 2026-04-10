// Importerer komponenter som brukes i hovedlayouten
import GraphView from "./components/GraphView";
import InputPanel from "./components/InputPanel.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import FilterDropdown from "./components/FilterDropdown";          
import { mockGraph } from "./components/MockGraph"; // slett når mockgraph slettes
// Importerer React hooks
import { useState, useRef } from "react";
import {layoutTree} from "./graph/layout.js"

function App() {
  // ----------------------------
  // STATE FOR REKKEFØLGE AV ASPEKTER
  // ----------------------------
  const [aspectOrder, setAspectOrder] = useState(["=", "%", "-", "$"]);

  // ----------------------------
  // STATE FOR FILTER                                              
  // ----------------------------
  const [activeAspect,   setActiveAspect]   = useState(["=", "%", "-", "$"]);
  const [activeRelation, setActiveRelation] = useState(["cross", "hierarchy"]);

  const graphRef = useRef(null);

  // ---------------------------------
  // GIR BRUKER MULIGHET TIL Å FLYTTE ASPEKTER I VILKÅRLIG REKKEFØLGE
  // ---------------------------------
  function moveLeft(index) {
    if (index === 0) return;
    const newOrder = [...aspectOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setAspectOrder(newOrder);
  }

  function moveRight(index) {
    if (index === aspectOrder.length - 1) return;
    const newOrder = [...aspectOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setAspectOrder(newOrder);
  }

  // ----------------------------
  // STATE FOR GRAFDATA
  // ----------------------------
  const [backendGraph, setBackendGraph] = useState(null);
  const graph = backendGraph || mockGraph;

  const layedoutNodes = graph
  ? layoutTree(graph)
  : [];

  return (
    <div>

      {/* Toppmeny */}
      <Navbar />

      {/* Hovedlayout med input til venstre og graf til høyre */}
      <div className="layout">

        {/* Venstre panel */}
        <div className="input-section">                           

          {/* InputPanel sender tekst til backend og oppdaterer graph */}
          <InputPanel
            setGraph={setBackendGraph}
            graphRef={graphRef}
            activeAspect={activeAspect}                         
            activeRelation={activeRelation}                        
          />

          {/* Filter dropdown — under inputfeltet */}
          <FilterDropdown                                         
            activeAspect={activeAspect}
            setActiveAspect={setActiveAspect}
            activeRelation={activeRelation}
            setActiveRelation={setActiveRelation}
          />

        </div>

        {/* Seksjon for visualisering */}
        <div className="tree-section">
          <h2>Trestruktur</h2>

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
                nodes={layedoutNodes}
                graph={graph}
                graphRef={graphRef}
            />
          ) : (
            <p>Ingen graf lastet</p>
          )}

        </div>

      </div>

      {/* Footer nederst */}
      <Footer />
    </div>
  );
}

export default App;
