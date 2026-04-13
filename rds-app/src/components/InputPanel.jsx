function InputPanel({ text, setText }) {
  return (
      <div className="input-section">
        <h2>Input</h2>

        <textarea
            rows="12"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste RDS script here..."
        />
      </div>
  );
}

export default InputPanel;