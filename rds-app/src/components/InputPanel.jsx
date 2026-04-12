import { useState, forwardRef, useImperativeHandle } from "react";
import { toPng } from "html-to-image";

const InputPanel = forwardRef(function InputPanel({ setGraph, graphRef, activeAspect, activeRelation }, ref) {

  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // ----------------------------
  // BUILD GRAPH
  // ----------------------------
  const handleBuild = async () => {

    console.log("==== Starter handlebuild");  // Sean tester
    setError("");

    if (!text.trim()) {
      setGraph(null);
      return;
    }

    try {
      const paramParts = [];
      const allAspects = ["=", "%", "-", "%%"];
      allAspects.forEach(a => {
          paramParts.push(`aspect_${a}=${activeAspect.includes(a) ? "true" : "false"}`);
      });
      const allRelations = ["cross"];
      allRelations.forEach(r => {
          paramParts.push(`rel_${r}=${activeRelation.includes(r) ? "true" : "false"}`);
      });
      const paramString = paramParts.join("&");
      console.log("URL params:", paramString);
      const response = await fetch(`http://localhost:8080/parse?${paramString}`, {
              method: "POST",
        headers: {
          "content-type": "text/plain",
          "Accept": "application/json"  // Sean Tester
        },
        body: text
      });

      console.log("Response: " + response);  // Sean tester
      if (!response.ok) {

        const errorText = await response.text();
        console.log("Backend error:", errorText);

        setError(
          "Ugyldig input.\n" +
          "Sørg for at linjene starter med %, = eller -"
        );

        return;
      }

      console.log("=== Reached graph")
      const graph = await response.json();
      console.log(graph);  // Sean tester
      console.log("Aspekter: " + graph.aspects)
      console.log("Keys for list:\n")
      console.log("Aspekter: ", graph.nodeDTO)
      setGraph(graph);




    } catch (err) {
      console.error("Network error:", err);
      setError("Noe gikk galt med serveren");
    }
  };

  // Eksponerer buildGraph til App.jsx via ref (for auto-oppdatering ved filterendring)
  useImperativeHandle(ref, () => ({
    buildGraph: () => handleBuild()
  }));

  // ----------------------------
  // DOWNLOAD IMAGE
  // ----------------------------
  const handleDownloadImage = async () => {

    const node = graphRef.current;

    if (!node) {
      alert("Fant ikke grafen");
      return;
    }

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2 
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


  // ----------------------------
  // DOWNLOAD TEXT
  // ----------------------------
  const handleDownloadText = () => {

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "RDSscript.txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  // ----------------------------
  // FILE UPLOAD
  // ----------------------------
  const handleFileUpload = (event) => {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      setText(e.target.result);
    };

    reader.readAsText(file);
  };


  return (
    <div className="input-section">

      <h2>Input</h2>

      <textarea
        rows="12"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        placeholder="Paste RDS script here..."
      />

      {/* ERROR */}
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* BUTTONS */}
      <div className="buttons">
        <button onClick={handleBuild}>Bygg tre</button>
        <button onClick={handleDownloadImage}>
          Last ned som bilde
        </button>
        <button onClick={handleDownloadText}>
          Last ned tekst
        </button>
      </div>

      {/* FILE UPLOAD */}
      <input
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
      />

    </div>
  );
});

export default InputPanel;