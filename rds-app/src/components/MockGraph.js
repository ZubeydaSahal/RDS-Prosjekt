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
    { id: "%DA1", label: "Spor (nettverkslink)", aspect: "%" },
    { id: "%DA2", label: "Sporveksel (nettverksnode)", aspect: "%" },
    { id: "%DA2.DA1", label: "Enkel sporveksel", aspect: "%" },
    { id: "%DA2.DA1.DA1", label: "Venstre", aspect: "%" },
    { id: "%DA2.DA1.DA2", label: "Høyre", aspect: "%" },
    { id: "%DA2.DA2", label: "Dobbel kryssveksel", aspect: "%" },
    { id: "%DA2.DA3", label: "Usymmetrisk dobbelveksel", aspect: "%" },
    { id: "%DA2.DA4", label: "Sporkryss", aspect: "%" },
    { id: "%DB1", label: "Sporvekselspor", aspect: "%" },
    { id: "%WRA1", label: "Sporgeometrielement", aspect: "%" },

    { id: "=R1", label: "Sporsystem", aspect: "=" },
    { id: "=R1.DA1", label: "Sporveksel 1", aspect: "=" },
    { id: "=L1", label: "Signal og sikring", aspect: "=" },
    { id: "=H1", label: "Sporvekselvarme", aspect: "=" },
    { id: "=Q1", label: "Stasjonsbelysning", aspect: "=" },
    { id: "=K1", label: "Kontaktledning", aspect: "=" },

    { id: "-R1", label: "Sporanlegg", aspect: "-" },
    { id: "-R1.DA1", label: "Sporveksel 1", aspect: "-" },
    { id: "-L1", label: "Signal- og sikringsanlegg", aspect: "-" },
    { id: "-H1", label: "Sporvekselvarmeanlegg", aspect: "-" },
    { id: "-Q1", label: "Belysningsanlegg", aspect: "-" },
    { id: "-K1", label: "Kontaktledningsanlegg", aspect: "-" },

    { id: "%%DA1", label: "Sporvekseltyper", aspect: "%%" },
    { id: "%%DA1.DA1", label: "Vossloh Nordic Switch Systems AB", aspect: "%%" },
    { id: "%%DA1.DA1.DA1", label: "EVR-60E1-760-1:14-V", aspect: "%%" },
    { id: "%%DA1.DA1.DA2", label: "EVR-60E1-760-1:14-H", aspect: "%%" },
    { id: "%%KB1", label: "Sporvekseldrivmaskintyper", aspect: "%%" }
  ],

  relations: [
    // root → aspects
    { from: "XCW", to: "aspect_%", type: "root" },
    { from: "XCW", to: "aspect_=", type: "root" },
    { from: "XCW", to: "aspect_-", type: "root" },
    { from: "XCW", to: "aspect_%%", type: "root" },

    // hierarchy (%)
    { from: "%DA2", to: "%DA2.DA1", type: "hierarchy" },
    { from: "%DA2.DA1", to: "%DA2.DA1.DA1", type: "hierarchy" },
    { from: "%DA2.DA1", to: "%DA2.DA1.DA2", type: "hierarchy" },

    // hierarchy (=)
    { from: "=R1", to: "=R1.DA1", type: "hierarchy" },

    // hierarchy (-)
    { from: "-R1", to: "-R1.DA1", type: "hierarchy" },

    // hierarchy (%%)
    { from: "%%DA1", to: "%%DA1.DA1", type: "hierarchy" },
    { from: "%%DA1.DA1", to: "%%DA1.DA1.DA1", type: "hierarchy" },
    { from: "%%DA1.DA1", to: "%%DA1.DA1.DA2", type: "hierarchy" },

    // cross relations (fra input)
    { from: "=R1.DA1", to: "%DA2.DA1.DA2", type: "B" },
    { from: "=R1.DA1", to: "-R1.DA1", type: "A" },
    { from: "-R1.DA1", to: "%%DA1.DA1.DA2", type: "B" }
  ]
};