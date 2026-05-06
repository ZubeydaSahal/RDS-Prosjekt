/* ASPECT VARIABLES */
export const ASPECTS = {
    "=": {
        label: "Function aspect",
        lineColour: "#f97316",
        nodeColour: "#ff8c5a",
        headerColour: "#ffd6bf",
    },
    "-": {
        label: "Product aspect",
        lineColour: "#6ccf4f",
        nodeColour: "#6ccf4f", /* Det var disse steinar kommenterte på  */
        headerColour: "#dff5dc",
    },
    "%": {
        label: "Type aspect",
        lineColour: "#3b82f6", /* Aspect relation line colour*/
        nodeColour: "#4da3ff", /* Aspect child colour*/
        headerColour: "#cfe8ff",  /* Aspect header colour*/
    },
    "%%": {
        label: "Type aspect (product)",
        lineColour: "#a855f7",
        nodeColour: "#9b8cff",
        headerColour: "#e6ddff",
    },
    /* Not ordered yet */
    "#": {
        label: "Other",
        lineColour: "#00ffbd",
        nodeColour: "#a8ffe7",
        headerColour: "#b3ffeb",
    },
    "$": {
        label: "Process",
        lineColour: "#ff3838",
        nodeColour: "#ff6c6c",
        headerColour: "#ff9f9f",
    },
    "+": {
        label: "Location aspect (point)",
        lineColour: "#facc15",
        nodeColour: "#ffe066",
        headerColour: "#fff5b1"
    },
    "++": {
        label: "Location aspect (site)",
        lineColour: "#10b981",   /* klar teal/grønn-blå som skiller seg fra alle andre */
        nodeColour: "#4fd1c5",   /* lysere teal for noden */
        headerColour: "#c7f2ef"  /* veldig lys teal for header */
    }

} as const;

/* "Getters" for attributes / values */

// Aspect list with symbols {"=", "-"..}
export const getAspectSymbols = Object.keys(ASPECTS)


// Aspect list with labels / names mapped to symbol {"=" : "function aspect", "-" : ...}
export const getAspectLabels = Object.fromEntries(
    Object.entries(ASPECTS).map(([symbol, data]) => [
        symbol,
        data.label,
    ])
);

// AspectLabelsArray – used in filterdropdown [{symbol : "aspect", label : "aspectname"}, {}...]
export const aspectLabelsArray = Object.entries(ASPECTS).map(([symbol, data]) => ({
    symbol,
    label: data.label,
}));

// Aspect line colour
export const aspectLineColour = Object.fromEntries(
    Object.entries(ASPECTS).map(([symbol, data]) => [
        symbol,
        data.lineColour,
    ])
);

// Aspect headercolour
export const aspectHeaderColour = Object.fromEntries(
    Object.entries(ASPECTS).map(([symbol, data]) => [
        symbol,
        data.headerColour,
    ])
);

// Aspect headercolour
export const aspectNodeColour = Object.fromEntries(
    Object.entries(ASPECTS).map(([symbol, data]) => [
        symbol,
        data.nodeColour,
    ])
);

// Export to JSON - for backend use
export function exportAspectsForBackend() {
    return Object.fromEntries(
        Object.entries(ASPECTS).map(([key, value]) => [
            key,
            {
                label: value.label
            }
        ])
    );
}




