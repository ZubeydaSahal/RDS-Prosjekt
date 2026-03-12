import GraphView from "./components/graph/GraphView"
import InputPanel from "./components/InputPanel.jsx";
import {useState} from "react";

function App() {
    const [graph, setGraph] = useState({
        nodes: [],
        relations: []
    });
  return (

    <div>
        <InputPanel setGraph={setGraph}/>
        <GraphView  graph = {graph}/>
    </div>

  )

}

export default App