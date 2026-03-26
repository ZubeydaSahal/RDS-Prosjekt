export const mockGraph = {
    root: {
      id: "XCW",
      label: "Stasjon XCW"
    },
  
    aspects: [
      { id: "%", label: "Typeaspekt", order: 0 },
      { id: "=", label: "Funksjonsaspekt", order: 1 },
      { id: "-", label: "Produktaspekt", order: 2 },
      { id: "%%", label: "Typeaspekt (produkt)", order: 3 }
    ],
  
    nodes: [
      { id: "%DA1", label: "Spor", aspect: "%" },
      { id: "%DA2", label: "Sporveksel", aspect: "%" },
      { id: "%DA2.DA1", label: "Enkel sporveksel", aspect: "%" },
  
      { id: "=R1", label: "Sporsystem", aspect: "=" },
      { id: "=R1.DA1", label: "Sporveksel 1", aspect: "=" }
    ],
  
    relations: [
      // root → aspects
      { from: "XCW", to: "aspect_%", type: "root" },
      { from: "XCW", to: "aspect_=", type: "root" },
      { from: "XCW", to: "aspect_-", type: "root" },
      { from: "XCW", to: "aspect_%%", type: "root" },
  
      // aspect → nodes
      { from: "aspect_%", to: "%DA1", type: "belongs" },
      { from: "aspect_%", to: "%DA2", type: "belongs" },
      { from: "aspect_%", to: "%DA2.DA1", type: "belongs" },
  
      { from: "aspect_=", to: "=R1", type: "belongs" },
      { from: "aspect_=", to: "=R1.DA1", type: "belongs" },
  
      // hierarchy
      { from: "%DA2", to: "%DA2.DA1", type: "hierarchy" },
  
      // cross
      { from: "%DA2.DA1", to: "=R1.DA1", type: "cross" }
    ]
  };