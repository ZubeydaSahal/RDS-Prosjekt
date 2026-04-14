import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";

import SplitPane from "../components/SplitPane";
import Menu from "../components/Menu";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function MainPage() {

    const [aspectOrder] = useState(["=", "-", "%", "%%"]);
    const [activeAspect, setActiveAspect] = useState(["=", "%", "-", "%%"]);
    const [activeRelation, setActiveRelation] = useState(["cross", "hierarchy"]);
    const [backendGraph, setBackendGraph] = useState(null);
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const graphRef = useRef(null);

    // FIX: riktig encoding av spesialtegn
    const encodeAspectKey = (a) =>
        a.replace(/%/g, "%25").replace(/=/g, "%3D");

    const handleBuild = async () => {
        setError("");

        if (!text.trim()) {
            setBackendGraph(null);
            return;
        }

        try {
            const paramParts = [];

            const allAspects = ["=", "%", "-", "%%"];
            allAspects.forEach(a => {
                const key = encodeAspectKey(a);
                paramParts.push(
                    `aspect_${key}=${activeAspect.includes(a) ? "true" : "false"}`
                );
            });

            const allRelations = ["cross"];
            allRelations.forEach(r => {
                paramParts.push(
                    `rel_${r}=${activeRelation.includes(r) ? "true" : "false"}`
                );
            });

            const paramString = paramParts.join("&");
            console.log("URL params:", paramString);

            const response = await fetch(
                `http://localhost:8080/parse?${paramString}`,
                {
                    method: "POST",
                    headers: {
                        "content-type": "text/plain",
                        "Accept": "application/json"
                    },
                    body: text
                }
            );

            if (!response.ok) {
                setError("Ugyldig input.\nSørg for at linjene starter med %, = eller -");
                return;
            }

            const graph = await response.json();
            setBackendGraph(graph);

        } catch (err) {
            console.error("Network error:", err);
            setError("Noe gikk galt med serveren");
        }
    };

    //Auto rebuild når filter endres
    useEffect(() => {
        if (backendGraph) {
            handleBuild();
        }
    }, [activeAspect, activeRelation]);

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
            alert("Kunne ikke laste ned bilde");
        }
    };

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

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => setText(e.target.result);
        reader.readAsText(file);
    };

    return (
        <div className="MainPage">
            <Navbar />

            <div className="main-content">
                <div className="main-box">

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

                    {error && <div className="error-box">{error}</div>}

                    <SplitPane
                        graph={backendGraph}
                        graphRef={graphRef}
                        aspectOrder={aspectOrder}
                        text={text}
                        setText={setText}
                    />

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default MainPage;