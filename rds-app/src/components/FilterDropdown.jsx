import { useState, useRef, useEffect } from "react";

const ASPECTS = [
  { symbol: "=",  label: "Funksjon aspektet" },
  { symbol: "%",  label: "Type aspekt for funksjon aspekt" },
  { symbol: "-",  label: "Produktaspektet" },
  { symbol: "%%", label: "Type aspekt for produktaspekt" },
];

const RELATIONS = [
  { type: "cross", label: "Kryssrelasjon" },
];

export default function FilterDropdown({
  activeAspect = [], setActiveAspect,
  activeRelation = [], setActiveRelation,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Lukk når man klikker utenfor
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ENDRING: oppdater state direkte når checkbox endres
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
  

  // Tell hvor mange filtre som er skrudd av
  const totalActive = activeAspect.length + activeRelation.length;
  const totalAll    = ASPECTS.length + RELATIONS.length;
  const hasFilter   = totalActive < totalAll;

  return (
    <div className="fd-wrapper" ref={ref}>

      {/* Trigger */}
      <button className="fd-trigger" onClick={() => setOpen(o => !o)}>
        <span>Filter</span>
        {hasFilter && (
          <span className="fd-badge">{totalActive}/{totalAll}</span>
        )}
        <span className="fd-chevron">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
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

          {/* Relasjoner */}
          <p className="fd-section-title">RELASJONER</p>
          <ul className="fd-list">
            {RELATIONS.map(({ type, label }) => (
              <li key={type}>
                <label className="fd-item">
                  <input
                    type="checkbox"
                    checked={activeRelation.includes(type)}
                    onChange={() => toggleRelation(type)}
                  />
                  <span className="fd-label">{label}</span>
                </label>
              </li>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
}