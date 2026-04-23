import { useState, useRef, useEffect } from "react";

const ASPECTS = [
  { symbol: "=",  label: "Function aspect" },
  { symbol: "%",  label: "Type aspect for function aspect" },
  { symbol: "-",  label: "Product aspect" },
  { symbol: "%%", label: "Type aspect for product aspect" },
];

export default function FilterDropdown({
  activeAspect = [], setActiveAspect,
  activeRelation = [], setActiveRelation,
  relationTypes = [],
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleAspect(symbol) {
    const next = activeAspect.includes(symbol)
      ? activeAspect.filter(a => a !== symbol)
      : [...activeAspect, symbol];
    setActiveAspect(next);
  }

  function toggleRelation(type) {
    const next = activeRelation.includes(type)
      ? activeRelation.filter(r => r !== type)
      : [...activeRelation, type];
    setActiveRelation(next);
  }

  const totalActive = activeAspect.length + activeRelation.length;
  const totalAll = ASPECTS.length + 1 + relationTypes.length; // +1 for "cross"
  const hasFilter = totalActive < totalAll;

  return (
    <div className="fd-wrapper" ref={ref}>

      <button className="fd-trigger" onClick={() => setOpen(o => !o)}>
        <span>Filter</span>
        {hasFilter && (
          <span className="fd-badge">{totalActive}/{totalAll}</span>
        )}
        <span className="fd-chevron">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="fd-dropdown">

          {/* ASPECTS */}
          <p className="fd-section-title">ASPECTS</p>
          <ul className="fd-list">
            {ASPECTS.map(({ symbol, label }) => (
              <li key={symbol}>
                <label className="fd-item">
                  <input
                    type="checkbox"
                    checked={activeAspect.includes(symbol)}
                    onChange={() => toggleAspect(symbol)}
                  />
                  <span className="fd-symbol">{symbol}</span>
                  <span className="fd-label">{label}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="fd-divider" />

          {/* RELATIONS — master toggle */}
          <p className="fd-section-title">RELATIONS</p>
          <ul className="fd-list">
            <li>
              <label className="fd-item">
                <input
                  type="checkbox"
                  checked={activeRelation.includes("cross")}
                  onChange={() => toggleRelation("cross")}
                />
                <span className="fd-label">Cross-relation</span>
              </label>
            </li>
          </ul>

          {/* RELATION TYPES — individuelle typer */}
          {relationTypes.length > 0 && activeRelation.includes("cross") && (
            <>
              <div className="fd-divider" />
              <p className="fd-section-title">RELATION TYPES</p>
              <ul className="fd-list">
                {relationTypes.map(type => (
                  <li key={type}>
                    <label className="fd-item fd-item-indented">
                      <input
                        type="checkbox"
                        checked={activeRelation.includes(type)}
                        onChange={() => toggleRelation(type)}
                      />
                      <span className="fd-label">{type === "none" ? "no type" : `|${type}|`}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}

          {relationTypes.length === 0 && (
            <span className="fd-empty">No relations in the graph</span>
          )}

        </div>
      )}
    </div>
  );
}