/* ASPECT VARIABLES */
export const ASPECTS = {
    "=": {
        label: "Function aspect",
        color: "#f97316",
        nodeColor: "#ff8c5a",
        headerColor: "#ffd6bf",
    },
    "%": {
        label: "Type aspect",
        color: "#3b82f6",
        nodeColor: "#4da3ff",
        headerColor: "#cfe8ff",
    },
    "-": {
        label: "Product aspect",
        color: "#6ccf4f",
        nodeColor: "#6ccf4f", /* Det var disse steinar kommenterte på  */
        headerColor: "#dff5dc",
    },
    "%%": {
        label: "Type aspect (product)",
        color: "#a855f7",
        nodeColor: "#9b8cff",
        headerColor: "#e6ddff",
    },
} as const;

/* "Getters" for attributes / values */

// Aspect list with symbols
export const aspectSymbols = Object.keys(ASPECTS)

// Aspect labels / names
export const aspectLabels = Object.entries(ASPECTS).map(([symbol, data]) => ({
    symbol,
    label: data.label,
}));




