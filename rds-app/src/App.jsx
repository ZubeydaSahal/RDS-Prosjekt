// Importerer komponenter som brukes i hovedlayouten
import GraphView from "./components/GraphView";
import InputPanel from "./components/InputPanel.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import FilterDropdown from "./components/FilterDropdown.jsx";

// Importerer React hooks
import { useState } from "react";

// Midlertidig testdata for å kunne utvikle frontend uten backend
// Denne skal fjernes når backend er ferdig
const testGraph = {
  root: "<Stasjon XCW>",
 
  // Liste med noder (elementer i grafen)
  nodes: [
    { id: "%DA1", label: "Spor" },
    { id: "%DA2", label: "Sporveksel" },
    { id: "%DA2.DA1", label: "Enkel" },
    { id: "%DA2.DA1.DA1", label: "Venstre" },
    { id: "%DA2.DA1.DA2", label: "Høyre" }
  ],
  // Relasjoner mellom noder (kan brukes til å tegne forbindelser)
  relations: [
    { from: "<Stasjon XCW>", to: "%DA1" },
    { from: "<Stasjon XCW>", to: "%DA2" },
    { from: "%DA2", to: "%DA2.DA1" },
    { from: "%DA2.DA1", to: "%DA2.DA1.DA1" },
    { from: "%DA2.DA1", to: "%DA2.DA1.DA2" }
  ]
};

function App() {

    /* 
  Kan fjerne denne kommentaren og slette testGraph under når backend er klar
   const [graph, setGraph] = useState({
    nodes: [],
    relations: []
  }); */

  // State som holder grafdata
  const [graph, setGraph]               = useState(testGraph);
  const [hasUserInput, setHasUserInput] = useState(false);

  // State som bestemmer rekkefølgen på aspektene (kolonnene)
  const [aspects, setAspects] = useState(["=", "%", "-", "$"]);

  // State for filter
  const [activeAspect,   setActiveAspect]   = useState(["=", "%", "-", "$"]);
  const [activeRelation, setActiveRelation] = useState(["cross", "hierarchy"]);

  function moveLeft(index) {
    if (index === 0) return;
    const newAspects = [...aspects];
    [newAspects[index - 1], newAspects[index]] =
      [newAspects[index], newAspects[index - 1]];
    setAspects(newAspects);
  }

  function moveRight(index) {
    if (index === aspects.length - 1) return;
    const newAspects = [...aspects];
    [newAspects[index], newAspects[index + 1]] =
      [newAspects[index + 1], newAspects[index]];
    setAspects(newAspects);
  }

  return (
    <div>

      {/* Toppmeny */}
      <Navbar />

      {/* Hovedlayout med input til venstre og graf til høyre */}
      <div className="layout">

        {/* Venstre panel */}
        <div className="input-section">

          {/* Filter dropdown */}
          <FilterDropdown
            activeAspect={activeAspect}
            setActiveAspect={setActiveAspect}
            activeRelation={activeRelation}
            setActiveRelation={setActiveRelation}
          />

          {/* InputPanel sender tekst til backend og oppdaterer graph */}
          <InputPanel
            setGraph={setGraph}
            setHasUserInput={setHasUserInput}
            activeAspect={activeAspect}
            activeRelation={activeRelation}
          />

        </div>

        {/* Seksjon for visualisering */}
        <div className="tree-section">
          <h2>Trestruktur</h2>

          <div className="aspect-controls">
            {aspects.map((aspect, index) => (
              <div key={aspect} className="aspect-item">
                <span>{aspect}</span>
                <button onClick={() => moveLeft(index)}>←</button>
                <button onClick={() => moveRight(index)}>→</button>
              </div>
            ))}
          </div>

          {/* Sender grafdata, aspekt-rekkefølge og aktive relasjoner videre */}
          <GraphView
            graph={hasUserInput ? graph : testGraph}
            aspects={aspects}
            activeRelation={activeRelation}
          />

        </div>

      </div>

      {/* Footer nederst */}
      <Footer />
    </div>
  );
}

export default App;