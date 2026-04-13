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
                className={"slider"}
                onMouseDown={() => {
                    window.addEventListener("mousemove", handleDrag);
                    window.addEventListener("mouseup", () => {
                        window.removeEventListener("mousemove", handleDrag);
                    }, {once: true});
                }}
            >


                <div className="slider-icon">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="9" cy="12" r="1"/>
                        <circle cx="9" cy="5" r="1"/>
                        <circle cx="9" cy="19" r="1"/>
                        <circle cx="15" cy="12" r="1"/>
                        <circle cx="15" cy="5" r="1"/>
                        <circle cx="15" cy="19" r="1"/>
                    </svg>
                </div>
            </div>

                {/*Right side*/}
            <div style={{flex: 1, minWidth: 0, minHeight: 0}}>
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