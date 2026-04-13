import { useState, useRef, useEffect } from "react";
import InputPanel from "./InputPanel";
import GraphView from "./GraphView";

export default function Menu({inputPanelRef, graphRef, graph, setBackendGraph, aspectOrder, activeAspect, activeRelation,}) {
    const [dividerPos, setDividerPos] = useState(50);
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const handleMouseDown = () => {
        isDragging.current = true;
        document.body.style.userSelect = "none";
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.userSelect = "auto";
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const newPos = ((e.clientX - rect.left) / rect.width) * 100;

        if (newPos > 10 && newPos < 90) {
            setDividerPos(newPos);
        }
    };

    // smoother dragging (works outside container)
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                height: "100vh",
                width: "100%",
            }}
        >
            {/* LEFT: InputPanel */}
            <div style={{ width: `${dividerPos}%`, padding: "10px", height: "100%", boxSizing: "border-box" }}>
                <InputPanel
                    ref={inputPanelRef}
                    setGraph={setBackendGraph}
                    graphRef={graphRef}
                    activeAspect={activeAspect}
                    activeRelation={activeRelation}
                />
            </div>

            {/* Divider */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    width: "6px",
                    cursor: "col-resize",
                    backgroundColor: "#ddd",
                    flexShrink: 0,
                    zIndex: 10,
                }}
            />

            {/* RIGHT: GraphView */}
            <div style={{
                flex: 1,
                padding: "10px",
                height: "100%",
                boxSizing: "border-box",
                minWidth: 0,
            }}>
                {graph ? (
                    <GraphView
                        graph={graph}
                        aspectOrder={aspectOrder}
                        graphRef={graphRef}
                    />
                ) : (
                    // ENDRING: tom hvit boks i stedet for "Ingen graf lastet"
                    <div className="graph-container"/>
                )}
            </div>
        </div>
    );
}