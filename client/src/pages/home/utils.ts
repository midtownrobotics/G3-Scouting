import { UserInformation } from "@shared/schemas/user";
import { Assignment, Block, UserBlockAssignment } from "@shared/schemas/schedule";
import { DateString } from "@shared/types";
import { getAssignmentDuration } from "../../Utils";

export function softenColor(hex?: string): string {
    if (hex === undefined) return ("hsl(0, 0.00%, 100.00%)")

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

export function getFormattedDate(d: Date) {
    let [M, D, h, m] = [d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
    const amPm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(M).padStart(2, "0")}/${String(D).padStart(2, "0")} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${amPm}`;
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

export function getFormattedAssignmentDuration(assignment?: Assignment, schedule?: UserBlockAssignment[]) {
    const remainingMinutes = getAssignmentDuration(assignment, schedule);
    if (remainingMinutes === null) return null;

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    if (minutes == 0 && hours !== 0) {
        return `${hours} hours`
    }

    if (hours > 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}${minutes ? ` ${minutes} minute${minutes !== 1 ? "s" : ""}` : ""}`;
    }

    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
}