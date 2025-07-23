import { TbaMatchData } from "./types";

export function getValueByPath(
    obj: TbaMatchData,
    path: string,
    alliance: "red" | "blue"
): number | undefined {
    const parts = path
        .split('.')
        .map(p => (p === '{$A}' ? alliance : p));

    let current: any = obj;
    for (let i = 0; i < parts.length; i++) {
        if (current == null) return undefined;
        current = current[parts[i]];
    }

    return parseFloat(current);
}