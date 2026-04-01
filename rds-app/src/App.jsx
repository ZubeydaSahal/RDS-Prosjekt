// Importerer komponenter som brukes i hovedlayouten
import GraphView from "./components/GraphView";
import InputPanel from "./components/InputPanel.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { mockGraph } from "./components/MockGraph"; // slett når mockgraph slettes 

// Importerer React hooks
import { useState } from "react";

function App() {
  // ----------------------------
  // STATE FOR REKKEFØLGE AV ASPEKTER
  // ----------------------------
  // Denne styrer KUN visning i frontend (ikke backend-data)
  const [aspectOrder, setAspectOrder] = useState(["=", "%", "-", "%%"]);


  // ---------------------------------
  // GIR BRUKER MULIGHET TIL Å FLYTTE ASPEKTER I VILKÅRLIG REKKEFØLGE 
  // ---------------------------------
  function moveLeft(index) {
    if (index === 0) return;
  
    const newOrder = [...aspectOrder];

    // Bytter plass med elementet til venstre
    [newOrder[index - 1], newOrder[index]] =
      [newOrder[index], newOrder[index - 1]];
  
    setAspectOrder(newOrder);
  }
  

  // Flytter aspekt til høyre
  function moveRight(index) {
    if (index === aspectOrder.length - 1) return;
  
    const newOrder = [...aspectOrder];

    // Bytter plass med elementet til høyre
    [newOrder[index], newOrder[index + 1]] =
      [newOrder[index + 1], newOrder[index]];
  
    setAspectOrder(newOrder);
  }


  // ----------------------------
  // STATE FOR GRAFDATA
  // ----------------------------
  // Starter med mock hvis toggle er true
  const [backendGraph, setBackendGraph] = useState(null);


  // ----------------------------
  //// Hvis backendGraph finnes → bruk backend
  // Hvis ikke → fallback til mockGraph
  // ----------------------------
  const graph = backendGraph || mockGraph; //############## Hvis noe skrives inn i input feltet brukes det, hvis ikke er det mockgraph


  return (
    <div>

      {/* Toppmeny */}
      <Navbar/>

      {/* Hovedlayout med input til venstre og graf til høyre */}
      <div className="layout">

        {/* InputPanel er ALLTID synlig */}
        <InputPanel setGraph={setBackendGraph} />

        {/* Seksjon for visualisering */}
        <div className="tree-section">
          <h2>Trestruktur</h2>

          {/* ----------------------------
              KONTROLLER FOR ASPEKT-REKKEFØLGE
          ---------------------------- */}
          <div className="aspect-controls">

            {aspectOrder.map((aspect, index) => (
              <div key={aspect} className="aspect-item">

                {/* Viser aspekt-id (% = - osv) */}
                <span>{aspect}</span>

                {/* Knapper for å flytte aspekt */}
                <button onClick={() => moveLeft(index)}>←</button>
                <button onClick={() => moveRight(index)}>→</button>

              </div>
            ))}

          </div>


          {/* ----------------------------
              VISER GRAF HVIS DATA FINNES
          ---------------------------- */}
          {graph ? (
            <GraphView 
              graph={graph} 
              aspectOrder={aspectOrder} 
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