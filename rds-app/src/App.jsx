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
  */

  // ----------------------------
  // STATE FOR REKKEFØLGE AV ASPEKTER
  // ----------------------------
  // Denne styrer KUN visning i frontend (ikke backend-data)
  const [aspectOrder, setAspectOrder] = useState(["=", "%", "-", "%%"]);


  //  ---------------------------------
  //GIR BRUKER MULIGHET TIL Å FLYTTE ASPEKTER I VILKÅRLIG REKKEFØLGE 
  // -----------------------------------
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
  // Når backend er klar, vil denne bli satt fra API-respons
  const [graph, setGraph] = useState(mockGraph);  // slett når mockgraph slettes 


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
              SENDER DATA TIL GRAPHVIEW
          ---------------------------- */}
          {/* graph = backend-data
              aspectOrder = frontend sin visningsrekkefølge */}
          <GraphView 
            graph={graph} 
            aspectOrder={aspectOrder} 
          />

        </div>

      </div>

      {/* Footer nederst */}
      <Footer />
    </div>
  );
}

export default App;