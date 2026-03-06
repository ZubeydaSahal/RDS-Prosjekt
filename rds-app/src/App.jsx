import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InputPanel from "./components/InputPanel.jsx";

function App() {

  return (
      <div className="layout">
          <InputPanel/>

          <div className="tree-section">
              <h2>Trestruktur</h2>
              <div id="treeContainer"></div>
          </div>
      </div>
  )
}

export default App
