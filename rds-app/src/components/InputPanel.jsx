import {useState} from "react";

export default function InputPanel( setGraph) {
    const [text, setText] = useState("");

    const handleBuild = async () => {
        try {
            const response = await fetch("http://localhost:8080/parse", {
                method : "POST",
                headers : {
                    "content-type" : "text/plain"
                },
                body : text
            });

            const graph = await response.json();
            console.log("nodes: ", graph.nodes);
            console.log("Relations: ", graph.relations)

            setGraph(graph);

        }
        catch (err){
            console.error("error sending script ", err);
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

            <div className="buttons">
                <button onClick={handleBuild}>Bygg tre</button>
                <button>Last ned som bilde</button>
            </div>
        </div>
    );
}