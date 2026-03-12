export const mockGraph = {
    id: "<Stasjon X.CW>",
    label: "Stasjon X.CW",
    relationType: null,
    children: [
  
      {
        id: "DA1",
        label: "Spor",
        relationType: "%",
        children: []
      },
  
      {
        id: "DA2",
        label: "Sporveksel",
        relationType: "%",
        children: [
          {
            id: "DA2.1",
            label: "Enkel sporveksel",
            relationType: "%",
            children: [
              {
                id: "DA2.1.1",
                label: "Venstre",
                relationType: "%",
                children: []
              },
              {
                id: "DA2.1.2",
                label: "Høyre",
                relationType: "%",
                children: []
              }
            ]
          }
        ]
      },
  
      {
        id: "R1",
        label: "Sporsystem",
        relationType: "=",
        children: []
      },
  
      {
        id: "P1",
        label: "Sporanlegg",
        relationType: "-",
        children: []
      },
  
      {
        id: "TP1",
        label: "Sporvekseltyper",
        relationType: "%%",
        children: []
      }
  
    ]
  }