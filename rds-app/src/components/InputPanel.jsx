
import { useState } from "react";

// activeAspects: hvilke aspekter som er aktive (fra App.jsx)
export default function InputPanel({ setGraph, setHasUserInput, activeAspects }) {

  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleBuild = async () => {
    setError("");

    if (!text.trim()) {
      setHasUserInput(false);
      setGraph(null);
      return;
    }

    try {
      // Bygg query-parameter: ?aspects=%,=,-,$
      const aspectParam = (activeAspects && activeAspects.length > 0)
        ? "?aspects=" + encodeURIComponent(activeAspects.join(","))
        : "";

      const response = await fetch(`http://localhost:8080/parse${aspectParam}`, {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: text,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Backend error:", errorText);
        setError(
          "Ugyldig input.\n" +
          "Sørg for at linjene starter med %, = eller -"
        );
        return;
      }

      const graph = await response.json();
      setGraph(graph);
      setHasUserInput(true);

    } catch (err) {
      console.error("Network error:", err);
      setError("Noe gikk galt med serveren");
    }
  };

  return (
    <div>
      <h2>Input</h2>

      <textarea
        rows="12"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (!e.target.value.trim()) setHasUserInput(false);
        }}
        placeholder="Paste RDS script here..."
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleBuild();
          }
        }}
      />

      {error && <div className="error-box">{error}</div>}

      <div className="buttons">
        <button onClick={handleBuild}>Bygg tre</button>
        <button>Last ned som bilde</button>
      </div>
    </div>
  );
}