export function expandIncludes(text, files, stack = []) {
    const lines = text.split(/\r?\n/);
    const linesToProcess = stack.length === 0
            ? lines
            : lines.slice(1); // Skip first line in additional files

    return linesToProcess.map(line => {
        const match = line.match(
            /^\s*#\s*INCLUDE\s+"([^"]+)"\s*$/
        );

        if (!match) return line;

        const filename = match[1];

        if (stack.includes(filename)) {
            throw new Error(
                `Loop include: ${filename}`
            );
        }

        if (!files.has(filename)) {
            throw new Error(
                `File not found: ${filename}`
            );
        }

        return expandIncludes(
            files.get(filename),
            files,
            [...stack, filename]
        );
    }).join("\n");
}