function InputPanel({ text, setText, onBuild}) {

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault(); // hindrer newline
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
            placeholder="Paste RDS script here... Press CMD + Enter to build tree"
        />
      </div>
  );
}

export default InputPanel;