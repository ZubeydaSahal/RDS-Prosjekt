import GraphView from "./components/graph/GraphView";
import InputPanel from "./components/InputPanel.jsx";
import Footer from "./components/Footer";
import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {

  const [graph, setGraph] = useState({
    nodes: [],
    relations: []
  });

  return (

    <div>
      <Navbar/>

      <div className="layout">

        <InputPanel setGraph={setGraph} />

        <div className="tree-section">
          <h2>Trestruktur</h2>
          <GraphView graph={graph} />
        </div>

      </div>

      <Footer />
    </div>
    

  );
}

export default App;