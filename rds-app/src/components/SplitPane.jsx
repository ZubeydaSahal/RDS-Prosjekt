import { useState } from "react";
import InputPanel from "./InputPanel";
import GraphView from "./GraphView";

function SplitPane({ graph, graphRef, aspectOrder, text, setText, onBuild }) {
    const [leftWidth, setLeftWidth] = useState(40);

    const handleDrag = (e) => {
        let newWidth = (e.clientX / window.innerWidth) * 100;
        newWidth = Math.min(90, Math.max(10, newWidth));
        setLeftWidth(newWidth);
    };

    return (
        <div className="split-pane-container">

            {/* Left side — width er dynamisk, må være inline */}
            <div className="split-left" style={{ width: `${leftWidth}%` }}>
                <InputPanel text={text} setText={setText} onBuild={onBuild} />
            </div>

            {/* Slider */}
            <div
                className="slider"
                onMouseDown={() => {
                    window.addEventListener("mousemove", handleDrag);
                    window.addEventListener("mouseup", () => {
                        window.removeEventListener("mousemove", handleDrag);
                    }, { once: true });
                }}
            >
                <div className="slider-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="12" r="1"/>
                        <circle cx="9" cy="5" r="1"/>
                        <circle cx="9" cy="19" r="1"/>
                        <circle cx="15" cy="12" r="1"/>
                        <circle cx="15" cy="5" r="1"/>
                        <circle cx="15" cy="19" r="1"/>
                    </svg>
                </div>
            </div>

            {/* Right side */}
            <div className="split-right">
                <GraphView graph={graph} graphRef={graphRef} aspectOrder={aspectOrder} />
            </div>

        </div>
    );
}

export default SplitPane;