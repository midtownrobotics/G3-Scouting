import { UserInformation } from "@shared/schemas/API";
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
    l = Math.min(0.95, l + 0.35);

    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function getCurrentBlockMins(): number {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return Math.floor(totalMinutes / 30) * 30;
}

export function getCurrentDate(): DateString {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}` as DateString;
}

export function makeDateFromDateString(date: DateString): Date {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function compareBlocksByDate(a: Block, b: Block) {
    return makeDateFromDateString(a.date).getTime() - makeDateFromDateString(b.date).getTime();
}

type CondensedRow = {
    assignmentName: string;
    assignmentColor: string;
    startTime: number;
    endTime: number;
    date: DateString;
    blockIds: number[];
};

export function condenseSchedule(userData: UserInformation): CondensedRow[] {    
    const { schedule } = userData.user;

    const result: CondensedRow[] = [];
    if (schedule.length === 0) return result;

    let current = schedule[0];

    let group: CondensedRow = {
        assignmentName: current.assignment.name,
        assignmentColor: current.assignment.color,
        startTime: current.block.time,
        endTime: current.block.time,
        date: current.block.date,
        blockIds: [current.block.id],
    };

    for (let i = 1; i < schedule.length; i++) {
        const prev = schedule[i - 1];
        const curr = schedule[i];

        const isSameAssignment = curr.assignment.id === prev.assignment.id;
        const isSameDate = curr.block.date === prev.block.date;
        const isConsecutiveTime = curr.block.time === prev.block.time + 30;

        if (isSameAssignment && isSameDate && isConsecutiveTime) {
            group.endTime = curr.block.time;
            group.blockIds.push(curr.block.id);
        } else {
            result.push(group);
            group = {
                assignmentName: curr.assignment.name,
                assignmentColor: curr.assignment.color,
                startTime: curr.block.time,
                endTime: curr.block.time,
                date: curr.block.date,
                blockIds: [curr.block.id],
            };
        }
    }

    result.push(group);
    return result;
}
