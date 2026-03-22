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

    </div>
  );
}




