export function getValueByPath(
    obj: any,
    path: string,
    alliance?: "red" | "blue"
): number | undefined {
    const parts = path
        .split('.')
        .map(p => (p === '{$A}' ? (alliance ? alliance : "") : p));

    let current: any = obj;
    for (let i = 0; i < parts.length; i++) {
        if (current == null) return undefined;
        current = current[parts[i]];
    }

    const floatVal = parseFloat(current);
    if (current === undefined || Number.isNaN(floatVal)) return;
    return floatVal;
}