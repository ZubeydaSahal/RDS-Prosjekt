import GraphView from "./components/GraphView";
import InputPanel from "./components/InputPanel.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import FilterDropdown from "./components/FilterDropdown";          
import { mockGraph } from "./components/MockGraph";

import { useState, useRef } from "react";

function App() {

  const [aspectOrder, setAspectOrder] = useState(["=", "%", "-", "%%"]);

  const [activeAspect, setActiveAspect] = useState(["=", "%", "-", "$"]);
  const [activeRelation, setActiveRelation] = useState(["cross", "hierarchy"]);

  const graphRef = useRef(null);

  const [backendGraph, setBackendGraph] = useState(null);

  function filterGraph(source) {
  if (!source) return null;

  // Filtrer aspects — behold bare aktive
  const filteredAspects = {};
  for (const [aspect, nodes] of Object.entries(source.aspects)) {
    if (activeAspect.includes(aspect)) {
      filteredAspects[aspect] = nodes;
    }
  }

  // Samle alle synlige node-IDer
  const visibleIds = new Set();
  for (const nodes of Object.values(filteredAspects)) {
    nodes.forEach(n => visibleIds.add(n.id));
  }

  // Filtrer relasjoner — sjekk type og at begge noder er synlige
  const filteredRelations = source.relations.filter(r => {
    if (!activeRelation.includes("cross")) return false;
    return visibleIds.has(r.from) && visibleIds.has(r.to);
  });

  return {
    ...source,
    aspects: filteredAspects,
    relations: filteredRelations,
  };
}

const raw = backendGraph || mockGraph;
const graph = filterGraph(raw);

  return (
    <div>

      <Navbar />

      <div className="layout">

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
          />

        </div>

        <div className="tree-section">
          <h2>Trestruktur</h2>

          {graph ? (
            <GraphView
              graph={graph}
              aspectOrder={aspectOrder}
              setAspectOrder={setAspectOrder}   
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