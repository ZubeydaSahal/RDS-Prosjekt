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
  const graph = backendGraph || mockGraph;

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