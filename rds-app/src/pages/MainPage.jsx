import {useState, useRef, useEffect, act} from "react";
import { toPng } from "html-to-image";

import SplitPane from "../components/SplitPane";
import Menu from "../components/Menu";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

import {getAspectSymbols} from "../../../config/aspects.ts";

function MainPage() {


    const [maxDepth, setMaxDepth] = useState(null);
    const [activeAspect, setActiveAspect] = useState(getAspectSymbols);
    // ENDRING: starter med "cross" aktiv
    const [activeRelation, setActiveRelation] = useState(["cross"]);
    const [backendGraph, setBackendGraph] = useState(null);
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [fullscreen, setFullscreen] = useState(false);
    const graphRef = useRef(null);

    console.log("activeAspects from state: "+activeAspect)
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape" && fullscreen) setFullscreen(false);
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [fullscreen]);

    // Beregn maks lokal dybde per aspektkolonne fra node-IDer (punktnotasjon)
    const graphMaxDepth = (() => {
        if (!backendGraph?.nodeDTO) return 0;
        let globalMax = 0;
        Object.entries(backendGraph.nodeDTO).forEach(([key, list]) => {
            if (key === "<root>" || !Array.isArray(list) || list.length === 0) return;
            const dotCounts = list.map(n => (n.id.match(/\./g) || []).length);
            const colDepth = Math.max(...dotCounts) - Math.min(...dotCounts);
            if (colDepth > globalMax) globalMax = colDepth;
        });
        return globalMax + 1;
    })();

    // Hent unike relasjonstyper fra backendGraph
    const allRelationTypes = backendGraph ? (backendGraph.relationDTO || []).map(r => r.type) : [];
    const hasUntypedRelations = allRelationTypes.some(t => !t);

     const relationTypes = [
        ...new Set(allRelationTypes.filter(Boolean)),
        ...(hasUntypedRelations ? ["none"] : []),
    ];


    // Når ny graf lastes — legg til alle relasjonstyper som aktive (behold "cross")
    useEffect(() => {
        if (relationTypes.length > 0) {
            setActiveRelation(prev => {
                const next = [...prev];
                relationTypes.forEach(t => {
                    if (!next.includes(t)) next.push(t);
                });
                return next;
            });
        }
    }, [backendGraph]);

    const handleBuild = async () => {
        setError("");
        if (!text.trim()) {
            setBackendGraph(null);
            setError("No data input")
            return;
        }
        try {
            const params = new URLSearchParams();

            // List of all aspects from config
            params.append("allAspects", JSON.stringify(getAspectSymbols));

            console.log("\n\n'getAspectSymbols': "+ getAspectSymbols)
            console.log("\n'ActiveAspects': "+ activeAspect)
            activeAspect.forEach(a => {
                params.append(`aspect_${a}`, "true");
            });

            // Send cross-filter (master toggle)
            params.append("rel_cross", activeRelation.includes("cross"));

            // Send individuelle relasjonstyper (A, B osv.) for kjente typer
            relationTypes.forEach(type => {
                params.append(`rel_${type}`, activeRelation.includes(type));
            });

            const url = `http://localhost:8080/parse?${params.toString()}`;
            console.log("URL:", url);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "text/plain",
                    "Accept": "application/json"
                },
                body: text
            });
            /*const paramParts = [];
            const encodeAspectKey = (a) => a.replace(/%/g, "%25").replace(/=/g, "%3D");
            const allAspects = activeAspect; // ["=", "%", "-", "%%"];
            console.log("\n\n\n\n\n\n\n\n====2 AspECT SYMBOLS =====: " +allAspects);
            allAspects.forEach(a => {
                paramParts.push(`aspect_${encodeAspectKey(a)}=${activeAspect.includes(a) ? "true" : "false"}`);
                console.log(a)
            });
            console.log("Etter push encode"+allAspects)
            // Send cross-filter (master toggle)
            paramParts.push(`rel_cross=${activeRelation.includes("cross") ? "true" : "false"}`);
            // Send individuelle relasjonstyper (A, B osv.) for kjente typer
            relationTypes.forEach(type => {
                paramParts.push(`rel_${type}=${activeRelation.includes(type) ? "true" : "false"}`);
            });
            const paramString = paramParts.join("&");
            console.log("ParamString: "+paramString)
            const response = await fetch(`http://localhost:8080/parse?${paramString}`, {
                method: "POST",
                headers: { "content-type": "text/plain", "Accept": "application/json" },
                body: text
            });*/
            if (!response.ok) {
                if (!text.includes("<")) {
                    setError("Invalid input. A topnode is required");
                } 
                return;
            }
            const graph = await response.json();
            setBackendGraph(graph);
        } catch (err) {
            console.error("Network error:", err);
            setError("Something went wrong with the server");
        }
    };

    // Auto-rebuild når filter endres
    useEffect(() => {
    if (backendGraph) handleBuild();
}, [activeAspect]); // bare aspekt trigger backend

    const handleDownloadImage = async () => {
        const node = graphRef.current;
        if (!node) { alert("Graph not found"); return; }
        try {
            const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement("a");
            link.download = "graph.png";
            link.href = dataUrl;
            link.click();
        } catch (err) {
            alert("Could not download image");
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

    if (fullscreen) {
        return (
            <div className="fullscreen-overlay">
                <Menu
                    activeAspect={activeAspect}
                    setActiveAspect={setActiveAspect}
                    activeRelation={activeRelation}
                    setActiveRelation={setActiveRelation}
                    relationTypes={relationTypes}
                    maxDepth={maxDepth}
                    setMaxDepth={setMaxDepth}
                    graphMaxDepth={graphMaxDepth}
                    onBuild={handleBuild}
                    onDownloadImage={handleDownloadImage}
                    onDownloadText={handleDownloadText}
                    onUploadFile={handleFileUpload}
                    onToggleFullscreen={() => setFullscreen(false)}
                    isFullscreen={true}
                />
                {error && <div className="error-box">{error}</div>}
                <SplitPane
                    graph={backendGraph}
                    graphRef={graphRef}
                    aspectOrder={activeAspect}
                    activeRelation={activeRelation}
                    maxDepth={maxDepth}
                    text={text}
                    setText={setText}
                    onBuild={handleBuild}
                />
            </div>
        );
    }

    console.log("MainPage over SplitPane 'AspectOrder': "+activeAspect)
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
                        relationTypes={relationTypes}
                        maxDepth={maxDepth}
                        setMaxDepth={setMaxDepth}
                        graphMaxDepth={graphMaxDepth}
                        onBuild={handleBuild}
                        onDownloadImage={handleDownloadImage}
                        onDownloadText={handleDownloadText}
                        onUploadFile={handleFileUpload}
                        onToggleFullscreen={() => setFullscreen(true)}
                    />

                    {error && <div className="error-box">{error}</div>}

                    <SplitPane
                        graph={backendGraph}
                        graphRef={graphRef}
                        aspectOrder={activeAspect}
                        activeRelation={activeRelation}
                        maxDepth={maxDepth}
                        text={text}
                        setText={setText}
                        onBuild={handleBuild}
                    />

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default MainPage;