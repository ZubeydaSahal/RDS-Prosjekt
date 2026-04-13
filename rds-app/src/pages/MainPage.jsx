import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";

import SplitPane from "../components/SplitPane";
import Menu from "../components/Menu"
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function MainPage() {

    // ----------------------------
    // ASPEKT-REKKEFØLGE (MASTER STATE)
    // ----------------------------
    const [aspectOrder] = useState(["=", "-", "%", "%%"]);
    /*"%": "Typeaspekt",
    "=": "Funksjonsaspekt",
    "-": "Produktaspekt",
    "%%": "Typeaspekt (produkt)"*/



    // ----------------------------
    // FILTER
    // ----------------------------
    const [activeAspect, setActiveAspect] = useState(["=", "%", "-", "%%"]);
    const [activeRelation, setActiveRelation] = useState(["cross", "hierarchy"]);


    // ----------------------------
    // DATA
    // ----------------------------
    const [backendGraph, setBackendGraph] = useState(null);
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const graphRef = useRef(null);

/*
    // ----------------------------
    // FLYTT ASPEKTER – Skulle fjernes
    // ----------------------------
    function moveLeft(index) {
      if (index === 0) return;

      const newOrder = [...aspectOrder];
      [newOrder[index - 1], newOrder[index]] =
        [newOrder[index], newOrder[index - 1]];

      setAspectOrder(newOrder);
    }

    function moveRight(index) {
      if (index === aspectOrder.length - 1) return;

      const newOrder = [...aspectOrder];
      [newOrder[index], newOrder[index + 1]] =
        [newOrder[index + 1], newOrder[index]];

      setAspectOrder(newOrder);
    }*/


    // ----------------------------
    // BUILD GRAPH
    // ----------------------------

    const handleBuild = async () => {
        console.log("==== Starter handlebuild");  // Sean tester
        setError("");

        // If input is empty
        if (!text.trim()) {
            setBackendGraph(null);
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

            // IF bad response
            if (!response.ok) {
                const errorText = await response.text();
                console.log("Response error:", errorText);

                setError(
                    "Ugyldig input.\n" +
                    "Sørg for at linjene starter med %, = eller -"
                );
                return;
            }

            console.log("=== Reached graph")
            const graph = await response.json();

            //Debug
            console.log(graph);  // Sean tester
            console.log("Aspekter: " + graph.aspects)
            console.log("Keys for list:\n")
            console.log("Aspekter: ", graph.nodeDTO)

            setBackendGraph(graph);




        } catch (err) {
            console.error("Network error:", err);
            setError("Noe gikk galt med serveren");
        }
    };

    // ----------------------------
    // AUTO REBUILD
    // ----------------------------
    useEffect(() => {
        if (backendGraph) {
            handleBuild();
        }
    }, [activeAspect, activeRelation]);


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
        <div>
            <Navbar/>
            <Menu
                activeAspect={activeAspect}
                setActiveAspect={setActiveAspect}
                activeRelation={activeRelation}
                setActiveRelation={setActiveRelation}
                onBuild={handleBuild}
                onDownloadImage={handleDownloadImage}
                onDownloadText={handleDownloadText}
                onUploadFile={handleFileUpload}
            />
        {error && (
            <div className="error-box">{error}</div>
        )}

            <SplitPane
                graph={backendGraph}
                graphRef={graphRef}
                aspectOrder={aspectOrder}
                text={text}
                setText={setText}
            />
            <Footer/>
        </div>
    );
}

export default MainPage;


/*return (
<div>

  <Navbar />

  <div className="layout">

    //{ VENSTRE PANEL }
<div className="input-section">

<InputPanel
    ref={inputPanelRef}
    setGraph={setBackendGraph}
    graphRef={graphRef}
    activeAspect={activeAspect}
    activeRelation={activeRelation}
/>

<FilterDropdown
    activeAspect={activeAspect}
    setActiveAspect={setActiveAspect}
    activeRelation={activeRelation}
    setActiveRelation={setActiveRelation}
    setRdsText={setRdsText}
/>

</div>

//{ HØYRE SIDE }
<div className="tree-section">
<h2>Trestruktur</h2>

<div className="aspect-controls">
    {aspectOrder.map((aspect, index) => (
        <div key={aspect} className="aspect-item">
            <span>{aspect}</span>
            <button onClick={() => moveLeft(index)}>←</button>
            <button onClick={() => moveRight(index)}>→</button>
        </div>
    ))}
</div>

{graph ? (
    <GraphView
        graph={graph}
        aspectOrder={aspectOrder}
        graphRef={graphRef}
    />
) : (
    // ENDRING: tom hvit boks i stedet for "Ingen graf lastet"
    <div className="graph-container" />
)}

</div>

</div>

<Footer />
</div>
);*/

