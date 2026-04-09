import { useState, useRef, useEffect } from "react";

const ASPECTS = [
  { symbol: "=", label: "Funksjon aspektet" },
  { symbol: "%", label: "Type aspekt for funksjon aspekt" },
  { symbol: "-", label: "produktapektet" },
  { symbol: "%%", label: "Type aspekt for produktaspekt "},
];

const RELATIONS = [
  { type: "cross",     label: "Kryssrelasjon" },
];

export default function FilterDropdown({
  activeAspect = [], setActiveAspect,
  activeRelation = [], setActiveRelation,
}) {
  const [open, setOpen] = useState(false);

  // Lokale kopier mens dropdown er åpen
  const [pendingAspect,   setPendingAspect]   = useState(activeAspect);
  const [pendingRelation, setPendingRelation] = useState(activeRelation);

  const ref = useRef(null);

  // Lukk når man klikker utenfor
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setPendingAspect(activeAspect);
        setPendingRelation(activeRelation);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeAspect, activeRelation]);

  function toggleAspect(symbol) {
    setPendingAspect(prev =>
      prev.includes(symbol) ? prev.filter(a => a !== symbol) : [...prev, symbol]
    );
  }

  function toggleRelation(type) {
    setPendingRelation(prev =>
      prev.includes(type) ? prev.filter(r => r !== type) : [...prev, type]
    );
  }

  function handleApply() {
    setActiveAspect(pendingAspect);
    setActiveRelation(pendingRelation);
    setOpen(false);
  }

  function handleOpen() {
    setPendingAspect(activeAspect);
    setPendingRelation(activeRelation);
    setOpen(o => !o);
  }

  // Tell hvor mange filtre som er skrudd av
  const totalActive = activeAspect.length + activeRelation.length;
  const totalAll    = ASPECTS.length + RELATIONS.length;
  const hasFilter   = totalActive < totalAll;

  return (
    <div className="fd-wrapper" ref={ref}>

      {/* Trigger */}
      <button className="fd-trigger" onClick={handleOpen}>
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
          <p className="fd-section-title">Aspekter</p>
          <ul className="fd-list">
            {ASPECTS.map(({ symbol, label }) => (
              <li key={symbol}>
                <label className="fd-item">
                  <input
                    type="checkbox"
                    checked={pendingAspect.includes(symbol)}
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
          <p className="fd-section-title">Relasjoner</p>
          <ul className="fd-list">
            {RELATIONS.map(({ type, label }) => (
              <li key={type}>
                <label className="fd-item">
                  <input
                    type="checkbox"
                    checked={pendingRelation.includes(type)}
                    onChange={() => toggleRelation(type)}
                  />
                  <span className="fd-label">{label}</span>
                </label>
              </li>
            ))}
          </ul>

          <button className="fd-apply" onClick={handleApply}>
            Bruk filter
          </button>

        </div>
      )}
    </div>
  );
}