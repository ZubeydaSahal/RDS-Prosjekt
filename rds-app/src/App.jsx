import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import FilterDropdown from "./components/FilterDropdown";
import Menu from "./components/Menu.jsx";

import { useState, useRef, useEffect } from "react";

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
  const [, setRdsText] = useState("");

  const graphRef = useRef(null);
  const inputPanelRef = useRef(null);

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
  // ENDRING: fjernet mockGraph — viser bare backend-data
  const graph = backendGraph;

  // Re-hent grafen automatisk når filter endres (kun hvis en graf allerede er lastet)
  useEffect(() => {
    if (backendGraph && inputPanelRef.current) {
      inputPanelRef.current.buildGraph();
    }
  }, [activeAspect, activeRelation, backendGraph]);

  return (
    <div>

      <Navbar />
      <Menu
          inputPanelRef={inputPanelRef}
          graphRef={graphRef}
          graph={graph}
          setBackendGraph={setBackendGraph}
          aspectOrder={aspectOrder}
          activeAspect={activeAspect}
          activeRelation={activeRelation}
      />
      <div className="layout">

        {/* VENSTRE PANEL */}
        <div className="input-section">

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

          <div className="aspect-controls">
            {aspectOrder.map((aspect, index) => (
              <div key={aspect} className="aspect-item">
                <span>{aspect}</span>
                <button onClick={() => moveLeft(index)}>←</button>
                <button onClick={() => moveRight(index)}>→</button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default App;