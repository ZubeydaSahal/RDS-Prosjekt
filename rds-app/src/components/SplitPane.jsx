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
        let newWidth = (e.clientX / window.innerWidth) * 100;

        // min 10% / max 90%
        newWidth = Math.min(90, Math.max(10, newWidth));

        setLeftWidth(newWidth);


    };

    return (
        <div className="split-pane-container">

            {/*// Left side*/}
            <div style={{width: `${leftWidth}%`, flexShrink: 0}}>
                <InputPanel
                    text={text}
                    setText={setText}
                />
            </div>

            {/*// Slider*/}
            <div
                style={{width: "2px", cursor: "col-resize", background: "gray"}}
                onMouseDown={() => {
                    window.addEventListener("mousemove", handleDrag);
                    window.addEventListener("mouseup", () => {
                        window.removeEventListener("mousemove", handleDrag);
                    }, {once: true});
                }}
            />

            {/*Right side*/}
            <div style={{flex: 1}}>
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