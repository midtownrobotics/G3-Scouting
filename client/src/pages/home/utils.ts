import { Block } from "@shared/schemas/schedule";
import { DateString } from "@shared/types";

export function softenColor(hex: string): string {
    // Convert hex to RGB
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Convert to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
            case gNorm: h = (bNorm - rNorm) / d + 2; break;
            case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h *= 60;
    }

    // Soften: reduce saturation and increase lightness slightly
    s = Math.max(0.1, s * 0.7);
    l = Math.min(0.95, l + 0.4);

    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function getCurrentTimeMins(): number {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return Math.floor(totalMinutes / 30) * 30;
}


export function getCurrentDate(): DateString {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, "0")}-${now.getDay().toString().padStart(2, "0")}` as DateString;
}

function makeDateFromDateString(date: DateString): Date {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function compareBlocksByDate(a: Block, b: Block) {
    return makeDateFromDateString(a.date as DateString).getTime() - makeDateFromDateString(b.date as DateString).getTime();
}