export const LogColors = {
    BG: {
        Black: "\x1b[40m",
        Red: "\x1b[41m",
        Green: "\x1b[42m",
        Yellow: "\x1b[43m",
        Blue: "\x1b[44m",
        Magenta: "\x1b[45m",
        Cyan: "\x1b[46m",
        White: "\x1b[47m"
    },
    TX: {
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m"
    }
} as const;

export function renderProgress(current: number, total: number, barWidth: number = 40) {
    const progress = current / total;
    const filled = Math.round(barWidth * progress);
    const empty = barWidth - filled;

    const bar = "█".repeat(filled) + "-".repeat(empty);
    const percent = (progress * 100).toFixed(1).padStart(5, " ");

    process.stdout.write(`\r[${bar}] ${percent}% (${current}/${total})`);
    if (current === total) process.stdout.write('\n');
}

/** Parses a number and rounds if decimal is defined. */
export function numberParser(val: string | number | undefined, decimal?: number) {
    if (val === undefined) return undefined;

    if (typeof val === "string") val = parseFloat(val);
    if (decimal === undefined) return val;

    decimal = 10**decimal;
    return Math.round(val*decimal)/decimal;
}