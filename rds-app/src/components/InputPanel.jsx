function InputPanel({ text, setText, onBuild }) {

  const handleKeyDown = (e) => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    console.log("KEY:", e.key, "META:", e.metaKey, "CTRL:", e.ctrlKey);
  
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      console.log("CMD+ENTER DETECTED");
      e.preventDefault();
=======
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault(); 
>>>>>>> Stashed changes
=======
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault(); 
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            placeholder="Paste RDS script here... Press cmd + Enter to build tree"
=======
=======
>>>>>>> Stashed changes
            placeholder="Paste RDS script here..."
>>>>>>> Stashed changes
        />
      </div>
  );
}

export default InputPanel;