import { useState } from "react";
import { toPng } from "html-to-image";

export default function InputPanel({ setGraph }) {

  const [text, setText] = useState("");
  const [error, setError] = useState(""); //ny state

  const handleBuild = async () => {

    setError("");
  
    if (!text.trim()) {
      setError("Skriv inn noe først");
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
  
      // SJEKK FØR json()
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
  
    } catch (err) {
      console.error("Network error:", err);
      setError(" Noe gikk galt med serveren");
    }
  };

  {/* Funksjonen for å laste ned bilde (lastet ned bibilotek: html-to-image)*/}
  const handleDownload = async () => {
    const node = document.getElementById("graph-wrapper");
  
    if (!node) {
      alert("Fant ikke grafen");
      return;
    }
  
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true, // unngår cache-problemer
      });
  
      const link = document.createElement("a");
      link.download = "graph.png";
      link.href = dataUrl;
      link.click();
  
    } catch (err) {
      console.error("Download failed:", err);
      alert("Kunne ikke laste ned bilde");
    }
  };

  return (
    <div className="input-section">

      <h2>Input</h2>

      <textarea
        rows="12"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste RDS script here..."
      />

      {/*FEIL VISNING */}
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* Knapper */}
      <div className="buttons">
        <button onClick={handleBuild}>Bygg tre</button>
        <button onClick={handleDownload}>
  Last ned som bilde
</button>      
</div>

    </div>
  );
}