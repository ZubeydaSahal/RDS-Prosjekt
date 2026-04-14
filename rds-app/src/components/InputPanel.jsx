function InputPanel({ text, setText, onBuild }) {

  const handleKeyDown = (e) => {
    console.log("KEY:", e.key, "META:", e.metaKey, "CTRL:", e.ctrlKey);
  
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      console.log("CMD+ENTER DETECTED");
      e.preventDefault();
      onBuild && onBuild();
    }
  };

  return (
      <div className="input-section">
        {/*<h2>Input</h2>*/}

        <textarea
            //rows="12"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste RDS script here... Press cmd + Enter to build tree"
        />
      </div>
  );
}

export default InputPanel;