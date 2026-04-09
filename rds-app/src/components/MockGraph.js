export const mockGraph = {
  aspects: {
    "%": [
      { id: "DA1", metadata: "Spor (nettverkslink)" },
      { id: "DA2", metadata: "Sporveksel (nettverksnode)" },
      { id: "DA2.DA1", metadata: "Enkel sporveksel" },
      { id: "DA2.DA1.DA1", metadata: "Venstre" },
      { id: "DA2.DA1.DA2", metadata: "Høyre" },
      { id: "DA2.DA2", metadata: "Dobbel kryssveksel" },
      { id: "DA2.DA3", metadata: "Usymmetrisk dobbelveksel" },
      { id: "DA2.DA4", metadata: "Sporkryss" },
      { id: "DB1", metadata: "Sporvekselspor" },
      { id: "WRA1", metadata: "Sporgeometrielement" }
    ],

    "=": [
      { id: "R1", metadata: "Sporsystem" },
      { id: "R1.DA1", metadata: "Sporveksel 1" },
      { id: "L1", metadata: "Signal og sikring" },
      { id: "H1", metadata: "Sporvekselvarme" },
      { id: "Q1", metadata: "Stasjonsbelysning" },
      { id: "K1", metadata: "Kontaktledning" }
    ],

    "-": [
      { id: "R1", metadata: "Sporanlegg" },
      { id: "R1.DA1", metadata: "Sporveksel 1" },
      { id: "L1", metadata: "Signal- og sikringsanlegg" },
      { id: "H1", metadata: "Sporvekselvarmeanlegg" },
      { id: "Q1", metadata: "Belysningsanlegg" },
      { id: "K1", metadata: "Kontaktledningsanlegg" }
    ],

    "%%": [
      { id: "DA1", metadata: "Sporvekseltyper" },
      { id: "DA1.DA1", metadata: "Vossloh Nordic Switch Systems AB" },
      { id: "DA1.DA1.DA1", metadata: "EVR-60E1-760-1:14-V" },
      { id: "DA1.DA1.DA2", metadata: "EVR-60E1-760-1:14-H" },
      { id: "KB1", metadata: "Sporvekseldrivmaskintyper" }
    ]
  },

  relations: [
    { from: "R1.DA1", to: "DA2.DA1.DA2", type: "cross" },
    { from: "R1.DA1", to: "DA1.DA1.DA2", type: "cross" }
  ]
};