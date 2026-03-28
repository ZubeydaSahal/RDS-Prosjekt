import { useState } from "react";

export default function InputPanel({ setGraph, setHasUserInput }) {

  const [text, setText] = useState("");
  const [error, setError] = useState(""); //ny state

  const handleBuild = async () => {

    setError("");
  
    if (!text.trim()) {
      setError("");
      setHasUserInput(false);
      setGraph(null);
      return;
    }
  
    try {
  
      const response = await fetch("http://localhost:8080/parse", {
        method: "POST",
        headers: {
          "content-type": "text/plain"
        },
        body: text
      });
  
      //SJEKK FØR json()
      if (!response.ok) {
  
        const errorText = await response.text();
  
        console.log("Backend error:", errorText);
  
        setError(
          "Ugyldig input.\n" +
          "Sørg for at linjene starter med %, = eller -"
        );
  
        return;
      }
  
      // KUN hvis OK
      const graph = await response.json();

setGraph(graph);
setHasUserInput(true);
  
    } catch (err) {
      console.error("Network error:", err);
      setError("Noe gikk galt med serveren");
    }
  };

  // denne funksjonen lar bruker laste opp en .txt fil programmet og setter det inn i input boksen.
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      setText(text);
    }
    reader.readAsText(file)
  }

  // denne funksjonen lagrer alt ifra inputteksten til en .txt fil.
  const handleDownload = () => {
    const blob = new Blob([text], {type: "text/plain"});

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a");
    link.href = url;
    link.download = "RDSscript.txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url)
  }

  return (
    <div className="input-section">

      <h2>Input</h2>
<textarea
  rows="12"
  value={text}
  onChange={(e) => {
    setText(e.target.value);

    if (!e.target.value.trim()) {
      setHasUserInput(false);
    }
  }}
  placeholder="Paste RDS script here..."

    /*Gjør det mulig å bygge tre med cmd/ctrl + Enter */
  onKeyDown={(e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleBuild();
    }
  }}
/>

      {/*FEIL VISNING */}
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <div className="buttons">
        <button onClick={handleBuild}>Bygg tre</button>
        <button>Last ned som bilde</button>
      </div>
      <div>
        <input type="file" accept=".txt" onChange={handleFileUpload}/>
      </div>
      <div>
        <button onClick={handleDownload}>download text to file</button>
      </div>

    </div>
  );
}




