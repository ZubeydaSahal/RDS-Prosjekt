import { useState } from "react";
import InputPanel from "./InputPanel";
import GraphView from "./GraphView";

// Devides:  input | output, handles state
function SplitPane({
    graph,
    graphRef,
    aspectOrder,
    text,
    setText,
}) {
    const [leftWidth, setLeftWidth] = useState(40);

    const handleDrag = (e) => {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        setLeftWidth(newWidth);
    };

    return (
        <div style={{ display: "flex", height: "100%" }}>

            {/*// Left side*/}
            <div style={{ width: `${leftWidth}%` }}>
                <InputPanel
                    text={text}
                    setText={setText}
                />
            </div>

            {/*// Slider*/}
            <div
                style={{ width: "5px", cursor: "col-resize", background: "gray" }}
                onMouseDown={() => {
                    window.addEventListener("mousemove", handleDrag);
                    window.addEventListener("mouseup", () => {
                        window.removeEventListener("mousemove", handleDrag);
                    }, { once: true });
                }}
            />

            {/*Right side*/}
            <div style={{ flex: 1 }}>
                <GraphView
                    graph={graph}
                    graphRef={graphRef}
                    aspectOrder={aspectOrder}
                />
            </div>
        </div>
    );
}

export default SplitPane;