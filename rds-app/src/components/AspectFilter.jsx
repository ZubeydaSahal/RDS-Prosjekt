import { useState, useRef, useEffect } from "react";

const ASPECTS = [
  { symbol: "=", label: "Function" },
  { symbol: "%", label: "Placement" },
  { symbol: "-", label: "Product" },
  { symbol: "$", label: "Economy" },
];

export default function AspectFilter({ activeAspects, setActiveAspects }) {
  const [open, setOpen] = useState(false);
  // Lokal kopi mens dropdown er åpen — Apply bekrefter
  const [pending, setPending] = useState(activeAspects);
  const ref = useRef(null);

  // Lukk dropdown når man klikker utenfor
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setPending(activeAspects); // reset pending hvis man lukker uten Apply
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeAspects]);

  function togglePending(symbol) {
    setPending(prev =>
      prev.includes(symbol)
        ? prev.filter(a => a !== symbol)
        : [...prev, symbol]
    );
  }

  function handleApply() {
    setActiveAspects(pending);
    setOpen(false);
  }

  function handleOpen() {
    setPending(activeAspects); // synkroniser pending med faktisk state
    setOpen(o => !o);
  }

  const activeCount = activeAspects.length;
  const allActive = activeCount === ASPECTS.length;

  return (
    <div className="af-wrapper" ref={ref}>

      {/* Trigger-knapp */}
      <button className="af-trigger" onClick={handleOpen}>
        <span>Aspekter</span>
        {!allActive && (
          <span className="af-badge">{activeCount}</span>
        )}
        <span className="af-chevron">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="af-dropdown">
          <p className="af-dropdown-title">Filter: Aspekt</p>

          <ul className="af-list">
            {ASPECTS.map(({ symbol, label }) => {
              const checked = pending.includes(symbol);
              return (
                <li key={symbol}>
                  <label className="af-item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePending(symbol)}
                    />
                    <span className="af-symbol">{symbol}</span>
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
