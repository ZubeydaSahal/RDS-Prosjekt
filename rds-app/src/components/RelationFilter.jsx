import { useState, useRef, useEffect } from "react";

const RELATIONS = [
  { type: "hierarchy", label: "Hierarki" },
  { type: "cross",     label: "Kryssrelasjon" },
];

export default function RelationFilter({ activeRelations, setActiveRelations }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(activeRelations);
  const ref = useRef(null);

  // Lukk dropdown når man klikker utenfor
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setPending(activeRelations);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeRelations]);

  function togglePending(type) {
    setPending(prev =>
      prev.includes(type)
        ? prev.filter(r => r !== type)
        : [...prev, type]
    );
  }

  function handleApply() {
    setActiveRelations(pending);
    setOpen(false);
  }

  function handleOpen() {
    setPending(activeRelations);
    setOpen(o => !o);
  }

  const activeCount = activeRelations.length;
  const allActive = activeCount === RELATIONS.length;

  return (
    <div className="af-wrapper" ref={ref}>

      {/* Trigger-knapp */}
      <button className="af-trigger" onClick={handleOpen}>
        <span>Relasjoner</span>
        {!allActive && (
          <span className="af-badge">{activeCount}</span>
        )}
        <span className="af-chevron">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="af-dropdown">
          <p className="af-dropdown-title">Filter: Relasjon</p>

          <ul className="af-list">
            {RELATIONS.map(({ type, label }) => {
              const checked = pending.includes(type);
              return (
                <li key={type}>
                  <label className="af-item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePending(type)}
                    />
                    <span className="af-label">{label}</span>
                  </label>
                </li>
              );
            })}
          </ul>

          <button className="af-apply" onClick={handleApply}>
            Bruk filter
          </button>
        </div>
      )}
    </div>
  );
}
