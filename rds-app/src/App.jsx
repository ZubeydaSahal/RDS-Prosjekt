// Importerer komponenter som brukes i hovedlayouten
import GraphView from "./components/GraphView";
import InputPanel from "./components/InputPanel.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { mockGraph } from "./components/MockGraph"; // slett når mockgraph slettes 

// Importerer React hooks
import { useState } from "react";

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
  const [graph, setGraph] = useState(mockGraph);  // slett når mockgraph slettes 

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




