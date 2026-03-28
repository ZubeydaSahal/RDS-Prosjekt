import { useState, useRef, useEffect } from "react";

const ASPECTS = [
  { symbol: "=", label: "Funksjon" },
  { symbol: "%", label: "Plassering" },
  { symbol: "-", label: "Produkt" },
  { symbol: "$", label: "Økonomi" },
];

const RELATIONS = [
  { type: "hierarchy", label: "Hierarki" },
  { type: "cross",     label: "Kryssrelasjon" },
];

export default function FilterDropdown({
  activeAspects,    setActiveAspects,
  activeRelations,  setActiveRelations,
}) {
  const [open, setOpen] = useState(false);

  // Lokale kopier mens dropdown er åpen
  const [pendingAspects,   setPendingAspects]   = useState(activeAspects);
  const [pendingRelations, setPendingRelations] = useState(activeRelations);

  const ref = useRef(null);

  // Lukk når man klikker utenfor
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        // reset pending
        setPendingAspects(activeAspects);
        setPendingRelations(activeRelations);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeAspects, activeRelations]);

  function toggleAspect(symbol) {
    setPendingAspects(prev =>
      prev.includes(symbol) ? prev.filter(a => a !== symbol) : [...prev, symbol]
    );
  }

  function toggleRelation(type) {
    setPendingRelations(prev =>
      prev.includes(type) ? prev.filter(r => r !== type) : [...prev, type]
    );
  }

  function handleApply() {
    setActiveAspects(pendingAspects);
    setActiveRelations(pendingRelations);
    setOpen(false);
  }

  function handleOpen() {
    setPendingAspects(activeAspects);
    setPendingRelations(activeRelations);
    setOpen(o => !o);
  }

  // Tell hvor mange filtre som er skrudd av
  const totalActive = activeAspects.length + activeRelations.length;
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

          {/* ── Aspekter ── */}
          <p className="fd-section-title">Aspekter</p>
          <ul className="fd-list">
            {ASPECTS.map(({ symbol, label }) => (
              <li key={symbol}>
                <label className="fd-item">
                  <input
                    type="checkbox"
                    checked={pendingAspects.includes(symbol)}
                    onChange={() => toggleAspect(symbol)}
                  />
                  <span className="fd-symbol">{symbol}</span>
                  <span className="fd-label">{label}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="fd-divider" />

          {/* ── Relasjoner ── */}
          <p className="fd-section-title">Relasjoner</p>
          <ul className="fd-list">
            {RELATIONS.map(({ type, label }) => (
              <li key={type}>
                <label className="fd-item">
                  <input
                    type="checkbox"
                    checked={pendingRelations.includes(type)}
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