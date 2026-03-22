// Importerer komponenter som brukes i hovedlayouten
import GraphView from "./components/GraphView";
import InputPanel from "./components/InputPanel.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

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

  function moveLeft(index) {
    if (index === 0) return;
  
    const newAspects = [...aspects];
  
    // bytt plass med elementet til venstre
    [newAspects[index - 1], newAspects[index]] =
      [newAspects[index], newAspects[index - 1]];
  
    setAspects(newAspects);
  }
  
  function moveRight(index) {
    if (index === aspects.length - 1) return;
  
    const newAspects = [...aspects];
  
    // bytt plass med elementet til høyre
    [newAspects[index], newAspects[index + 1]] =
      [newAspects[index + 1], newAspects[index]];
  
    setAspects(newAspects);
  }

  // State som holder grafdata
  // Når backend er klar, vil denne bli satt fra API-respons
  const [graph, setGraph] = useState(testGraph);

  // State som bestemmer rekkefølgen på aspektene (kolonnene)
  // Dette er frontend-logikk (visualisering), ikke backend-data
  const [aspects, setAspects] = useState(["=", "%", "-", "%%"]);

  return (
    <div>

      {/* Toppmeny */}
      <Navbar/>

      {/* Hovedlayout med input til venstre og graf til høyre */}
      <div className="layout">

        {/* InputPanel sender tekst til backend og oppdaterer graph */}
        <InputPanel setGraph={setGraph} />

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

          {/* Sender både grafdata og aspekt-rekkefølge videre */}
          <GraphView graph={graph} aspects={aspects} />
        </div>

      </div>

      {/* Footer nederst */}
      <Footer />
    </div>
  );
}

export default App;




