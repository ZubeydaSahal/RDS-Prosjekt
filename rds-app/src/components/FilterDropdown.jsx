import { useState, useRef, useEffect } from "react";

const ASPECTS = [
   { type: "cross",label: "Kryssrelasjon" },
  { symbol: "=",  label: "Funksjon aspektet" },
  { symbol: "%",  label: "Type aspekt for funksjon aspekt" },
  { symbol: "-",  label: "Produktaspektet" },
  { symbol: "%%", label: "Type aspekt for produktaspekt" },
];

export default function FilterDropdown({
  activeAspect = [], setActiveAspect,
  activeRelation = [], setActiveRelation,
  // ENDRING: mottar relasjonstyper dynamisk fra App.jsx
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

  // ENDRING: tell alle aktive — aspekter + relasjonstyper
  const totalActive = activeAspect.length + activeRelation.length;
  const totalAll = ASPECTS.length + relationTypes.length;
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

          {/* Aspekter */}
          <p className="fd-section-title">ASPEKTER</p>
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

          {/* ENDRING: relasjonstyper dynamisk fra grafen */}
          <p className="fd-section-title">RELASJONSTYPER</p>
          <ul className="fd-list">
            {relationTypes.length === 0 && (
              <li><span className="fd-label" style={{ color: "#aaa" }}>Ingen relasjoner i grafen</span></li>
            )}
            {relationTypes.map(type => (
              <li key={type}>
                <label className="fd-item">
                  <input
                    type="checkbox"
                    checked={activeRelation.includes(type)}
                    onChange={() => toggleRelation(type)}
                  />
                  <span className="fd-label">|{type}|</span>
                </label>
              </li>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
}