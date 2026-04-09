export const mockGraph = {
  aspects: {
    "%": [
      { id: "DA1", name: "Spor (nettverkslink)" },
      { id: "DA2", name: "Sporveksel (nettverksnode)" },
      { id: "DA2.DA1", name: "Enkel sporveksel" },
      { id: "DA2.DA1.DA1", name: "Venstre" },
      { id: "DA2.DA1.DA2", name: "Høyre" },
      { id: "DA2.DA2", name: "Dobbel kryssveksel" },
      { id: "DA2.DA3", name: "Usymmetrisk dobbelveksel" },
      { id: "DA2.DA4", name: "Sporkryss" },
      { id: "DB1", name: "Sporvekselspor" },
      { id: "WRA1", name: "Sporgeometrielement" }
    ],

    "=": [
      { id: "R1", name: "Sporsystem" },
      { id: "R1.DA1", name: "Sporveksel 1" },
      { id: "L1", name: "Signal og sikring" },
      { id: "H1", name: "Sporvekselvarme" },
      { id: "Q1", name: "Stasjonsbelysning" },
      { id: "K1", name: "Kontaktledning" }
    ],

    "-": [
      { id: "R1", name: "Sporanlegg" },
      { id: "R1.DA1", name: "Sporveksel 1" },
      { id: "L1", name: "Signal- og sikringsanlegg" },
      { id: "H1", name: "Sporvekselvarmeanlegg" },
      { id: "Q1", name: "Belysningsanlegg" },
      { id: "K1", name: "Kontaktledningsanlegg" }
    ],

    "%%": [
      { id: "DA1", name: "Sporvekseltyper" },
      { id: "DA1.DA1", name: "Vossloh Nordic Switch Systems AB" },
      { id: "DA1.DA1.DA1", name: "EVR-60E1-760-1:14-V" },
      { id: "DA1.DA1.DA2", name: "EVR-60E1-760-1:14-H" },
      { id: "KB1", name: "Sporvekseldrivmaskintyper" }
    ]
  },

  relations: [
    { from: "R1.DA1", to: "DA2.DA1.DA2", type: "cross" },
    { from: "R1.DA1", to: "R1.DA1", type: "cross" },
    { from: "R1.DA1", to: "DA1.DA1.DA2", type: "cross" }
  ]
};