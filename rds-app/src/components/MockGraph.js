export const mockGraph = {
    root: "<Stasjon XCW>",
  
    aspects: [
      { type: "%", label: "Typeaspekt" },
      { type: "=", label: "Funksjonsaspekt" },
      { type: "-", label: "Produktaspekt" },
      { type: "%%", label: "Typeaspekt (produkt)" }
    ],
  
    nodes: [
      { id: "%DA1", label: "Spor" },
      { id: "%DA2", label: "Sporveksel" },
      { id: "%DA2.DA1", label: "Enkel sporveksel" },
      { id: "%DA2.DA1.DA1", label: "Venstre" },
      { id: "%DA2.DA1.DA2", label: "Høyre" },
      { id: "%DA2.DA2", label: "Dobbel kryssveksel" },
      { id: "%DA2.DA3", label: "Usymmetrisk dobbelveksel" },
      { id: "%DA2.DA4", label: "Sporkryss" },
      { id: "%DB1", label: "Sporvekselspor" },
      { id: "%WRA1", label: "Sporgeometrielement" },
  
      { id: "=R1", label: "Sporsystem" },
      { id: "=R1.DA1", label: "Sporveksel 1" }
    ],
  
    relations: [
      { from: "%DA2", to: "%DA2.DA1" },
      { from: "%DA2.DA1", to: "%DA2.DA1.DA1" },
      { from: "%DA2.DA1", to: "%DA2.DA1.DA2" },
  
      { from: "=R1", to: "=R1.DA1" },
  
      // eksempel på kryss-relasjon (som backend har)
      { from: "%DA2.DA1", to: "=R1.DA1", type: "cross" }
    ]
  };