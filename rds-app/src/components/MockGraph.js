export const mockGraph = {
    root: "<Stasjon XCW>",
  
    aspects: [
      { type: "%", label: "Typeaspekt" },
      { type: "=", label: "Funksjonsaspekt" },
      { type: "-", label: "Produktaspekt" },
      { type: "%%", label: "Typeaspekt (produkt)" }
    ],
  
    nodes: [
      { id: "%DA1", name: "Spor", description: "nettverklink" },
      { id: "%DA2", name: "Sporveksel", description: "nettverknode" },
      { id: "%DA2.DA1", name: "Enkel sporveksel" },
      { id: "%DA2.DA1.DA1", name: "Venstre" },
      { id: "%DA2.DA1.DA2", name: "Høyre" },
      { id: "%DA2.DA2", name: "Dobbel kryssveksel" },
      { id: "%DA2.DA3", name: "Usymmetrisk dobbelveksel" },
      { id: "%DA2.DA4", name: "Sporkryss" },
      { id: "%DB1", name: "Sporvekselspor" },
      { id: "%WRA1", name: "Sporgeometrielement" },
  
      { id: "=R1", name: "Sporsystem" },
      { id: "=R1.DA1", name: "Sporveksel 1" }
    ],
  
    relations: [
      { from: "%DA2", to: "%DA2.DA1" },
      { from: "%DA2.DA1", to: "%DA2.DA1.DA1" },
      { from: "%DA2.DA1", to: "%DA2.DA1.DA2" },
  
      { from: "=R1", to: "=R1.DA1" },
  
      { from: "%DA2.DA1", to: "=R1.DA1", type: "cross" }
    ]
  };